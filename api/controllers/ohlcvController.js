import fs from 'fs';

import { readOHLCVData, getOHLCVData } from '../../helpers/ohlcv_helpers.js';
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

export const createOHLCVFileController = async (req, res) => {
  const { name } = req.body;

  const data = await getOHLCVData({ name });

  if (data.error) {
    return handlerResponse(
      res,
      400,
      null,
      `couldn't get ${name} data ${data.error}`
    );
  } else {
    handlerResponse(res, 200, null, `data succesfully added`);
  }
};
