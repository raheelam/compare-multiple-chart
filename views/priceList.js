let seriesOptions = [],
  seriesCounter = 0;
let names = ['ADA', 'XRP', 'MATIC'];
const groupingUnits = [
  [
    'hour', // unit name
    [1], // allowed multiples
  ],
  ['minute', [1]],
  [
    'week', // unit name
    [1], // allowed multiples
  ],
  ['month', [1, 2, 3, 4, 6]],
];

function success(data, name) {
  let ohlc = [],
    volume = [],
    price = [];

  //split into price,  ohcl and volume
  for (let i = 0; i < data.length; i += 1) {
    price.push([
      data[i][0], //date
      data[i][4], //close
    ]);
    ohlc.push([
      data[i][0], // the date
      data[i][1], // open
      data[i][2], // high
      data[i][3], // low
      data[i][4], // close
    ]);

    volume.push([
      data[i][0], // the date
      data[i][5], // the volume
    ]);
  }
  let sI = names.indexOf(name.toUpperCase());
  if (seriesOptions.length > 0) {
    sI *= 2;
  }
  seriesOptions[sI] = {
    // type: 'candlestick',
    id: name + '-ohcl',
    name: name,
    data: price,
    // pointStart: Date.UTC(2022, 8, 0),
    // pointInterval: 60 * 1000,
  };
  seriesOptions[sI + 1] = {
    type: 'column',
    id: name + '-volume',
    name: name,
    data: volume,
    yAxis: 1, //+ sI / 2,
  };
  // seriesOptions[sI + 2] = {
  //   type: 'vbp',
  //   linkedTo: name + '-ohcl',
  //   params: {
  //     volumeSeriesID: name + '-volume',
  //   },
  //   dataLabels: {
  //     enabled: false,
  //   },
  //   zoneLines: {
  //     enabled: false,
  //   },
  // };

  // seriesOptions[sI + 3] = {
  //   type: 'sma',
  //   linkedTo: name + '-ohcl',
  //   zIndex: 1,
  //   marker: {
  //     enabled: false,
  //   },
  // };

  // As we're loading the data asynchronously, we don't know what order it
  // will arrive. So we keep a counter and create the chart when all the data is loaded.
  seriesCounter += 1;

  if (seriesCounter === names.length) {
    createChart();
  }
}

const createChart = () => {
  Highcharts.stockChart('container', {
    plotOptions: {
      series: {
        dataGrouping: {
          units: groupingUnits,
        },
        // compare: 'value',  //this compare the values as they are rising and falling
        // showInNavigator: false,
      },
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: [
      {
        startOnTick: false,
        endOnTick: false,
        title: {
          text: 'Currencies',
        },
        labels: {
          // formatter: function () {
          //   return (this.value > 0 ? ' + ' : '') + this.value + '%';
          // },

          align: 'left',
          x: -3,
        },
        height: '70%',
        resize: {
          enabled: true,
        },
      },
      {
        min: 0,
        title: {
          text: 'Volume',
        },
        labels: {
          align: 'left',
          x: -3,
        },
        top: '70%',
        height: '30%',
        offset: 0,
      },
      // {
      //   min: 0,
      //   title: {
      //     text: 'Volume',
      //   },
      //   labels: {
      //     align: 'left',
      //     x: -3,
      //   },
      //   top: '60%',
      //   height: '20%',
      //   offset: 1,
      // },
      // {
      //   title: {
      //     text: 'Volume',
      //   },
      //   labels: {
      //     align: 'left',
      //     x: -3,
      //   },
      //   top: '80%',
      //   height: '20%',
      //   offset: 2,
      // },
    ],
    tooltip: {
      shape: 'square',
      headerShape: 'callout',
      borderWidth: 0,
      shadow: false,
      positioner: function (width, height, point) {
        let chart = this.chart,
          position;

        if (point.isHeader) {
          position = {
            x: Math.max(
              // Left side limit
              chart.plotLeft,
              Math.min(
                point.plotX + chart.plotLeft - width / 2,
                // Right side limit
                chart.chartWidth - width - chart.marginRight
              )
            ),
            y: point.plotY,
          };
        } else {
          position = {
            x: point.series.chart.plotLeft,
            y: point.series.yAxis.top - chart.plotTop,
          };
        }
        return position;
      },
    },
    series: seriesOptions,
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 800,
          },
          chartOptions: {
            rangeSelector: {
              inputEnabled: false,
            },
          },
        },
      ],
    },
  });
};

const getCryptoData = async (name, callback) => {
  try {
    const response = await fetch(`/ohlcv/${name}`);
    const data = await response.json();

    callback(data, name);
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const init = async () => {
  await getCryptoData('ADA', success);
  await getCryptoData('XRP', success);
  await getCryptoData('MATIC', success);
};

init();
