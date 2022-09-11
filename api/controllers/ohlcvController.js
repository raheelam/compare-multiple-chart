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

//not fully implemented only use incase if new crypto needs to be added
export const addOHLCVFileController = async (req, res) => {
  const name = req.params.name;
  const path = `${__dirname}/data/${name}_OHLCV_Data.csv`;
  const isExists = fs.existsSync(path);
  if (isExists)
    return handlerResponse(res, 400, null, `${name} file already exists`);

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
