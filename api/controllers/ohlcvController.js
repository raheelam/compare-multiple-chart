import fs from 'fs';

import { getData } from '../../helpers/data_helpers.js';
import {
  readOHLCVData,
  getOHLCVData,
  addOHLCVData,
} from '../../helpers/ohlcv_helpers.js';
import handlerResponse from '../../helpers/responseHandler.js';
import { __dirname } from '../../server.js';

export const getOHLCVFileDataController = async (req, res) => {
  try {
    const { name } = req.params;
    const path = `${__dirname}/data/${name}_OHLCV_Data.csv`;

    fs.access(path, fs.F_OK, async (err) => {
      if (err) {
        const data = await getOHLCVData({ name });
        if (data.error) {
          return handlerResponse(
            res,
            400,
            null,
            `couldn't get ${name} data ${data.error}`
          );
        }
      }
      readOHLCVData(path, res);
    });
  } catch (err) {
    console.log(err);
    handlerResponse(res, 400, null, 'couldnt fetch data');
  }
};

export const updateOHLCVFileController = (req, res) => {
  //add implementation for update csv
  //check if the data isnt already there before adding
  res.status(200).send();
};

export const addOHLCVFileController = async (req, res) => {
  const name = req.params.name;
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() - 1, 0);
  const symbol = req.query.symbol ?? `BITSTAMP_SPOT_${name}_USD`;
  const period_id = req.query.period_id ?? '1DAY';
  const time_start = req.query.time_start ?? currentDate.toISOString();
  const path = `/v1/ohlcv/${symbol}/history?period_id=${period_id}&time_start=${time_start}`;
  const data = await getData(path);

  if (data.error) {
    res.send('error occured');
  } else {
    addOHLCVData({ name, data });
    res.send('data successfully added');
  }
};
