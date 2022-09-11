import fs from 'fs';
import { __dirname } from '../server.js';
import { getData } from './data_helpers.js';
import { errorHandler } from './error.js';
import handlerResponse from './responseHandler.js';

export const readOHLCVData = (path, res) => {
  const checkTime = 10;
  const timerId = setInterval(() => {
    const isExists = fs.existsSync(path);
    if (isExists) {
      fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
          return handlerResponse(
            res,
            400,
            null,
            'something happened while reading file'
          );
        }

        data = data.split('\r\n');
        data = data.filter((n) => n.length !== 0);
        data.shift();

        for (const i in data) {
          const cols = data[i].split(',');
          cols.forEach((value, index, arr) => {
            if (index > 0) {
              arr[index] = parseFloat(value);
            } else {
              arr[index] = new Date(cols[0].trim()).getTime();
            }
          });
          data[i] = cols;
        }
        handlerResponse(res, 200, data, 'succesfully fetched data');
      });
      clearInterval(timerId);
    }
  }, checkTime);
};

export const getOHLCVData = async ({ name, symbol, periodId, timeStart }) => {
  try {
    if (!name) {
      return errorHandler('please provide name');
    }

    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 1, 0);
    if (!timeStart) timeStart = currentDate.toISOString();
    if (!symbol) symbol = `BITSTAMP_SPOT_${name}_USD`;
    if (!periodId) periodId = '1DAY';

    const urlPath = `/v1/ohlcv/${symbol}/history?period_id=${periodId}&time_start=${timeStart}`;
    const data = await getData(urlPath);

    if (data.error) {
      return errorHandler('couldnt fetch data', data.error);
    } else {
      await addOHLCVData({ name, data });
      return {
        success: true,
        message: 'data successfully added to csv file',
      };
    }
  } catch (error) {
    return errorHandler('', error);
  }
};

export const addOHLCVData = async ({ name, data }) => {
  let priceData = '';
  const path = `${__dirname}/data/${name}_OHLCV_Data.csv`;
  fs.access(path, fs.F_OK, (err) => {
    for (const ohlcv of data) {
      const {
        time_period_start,
        price_open,
        price_high,
        price_low,
        price_close,
        volume_traded,
      } = ohlcv;
      priceData += `\r\n${time_period_start},${price_open},${price_high},${price_low},${price_close},${volume_traded}`;
    }

    if (err) {
      const headingData =
        'Date,price_open,price_high,price_low,price_close,volume_traded';
      const completeData = headingData + priceData;
      try {
        return fs.writeFileSync(path, completeData);
      } catch (err) {
        return errorHandler(`adding ${name} failed`, err);
      }
    }
    try {
      return fs.appendFileSync(path, priceData);
    } catch (err) {
      return errorHandler(`editing ${name} failed`, err);
    }
  });
};

export const updateOHLCVFile = async (name) => {
  const path = `${__dirname}/data/${name}_OHLCV_Data.csv`;
  const isExists = fs.existsSync(path);
  if (!isExists) return;
  fs.readFile(path, 'utf8', async (err, data) => {
    if (err) {
      //logg itt
      //   'something happened while reading file'
    }
    const isEmpty = data.length === 0;
    const dataLines = data.split('\r\n');
    const lastLine = dataLines[dataLines.length - 1];
    const lastLinecols = lastLine.split(',');
    const lastLineDate = !isEmpty ? new Date(lastLinecols[0].trim()) : '';
    const currentDate = new Date();

    if (isEmpty || lastLineDate.getDate() < currentDate.getDate()) {
      if (!isEmpty)
        fs.truncate(path, data.length - lastLine.length, function () {
          console.log('done');
        });
      await getOHLCVData({
        name,
        timeStart: isEmpty ? null : lastLineDate.toISOString(),
      });
    }
    //log success
  });
};
