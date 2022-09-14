import fs from 'fs';
import { body } from 'express-validator';
import { __dirname } from '../server.js';

export const validateCryptoName = () => {
  return [
    body('name').customSanitizer((value, { req }) => {
      const name = req.body.name;
      const path = `${__dirname}/data/${name}_OHLCV_Data.csv`;
      const isExists = fs.existsSync(path);

      if (isExists) return Promise.reject('file already exists');
      return value;
    }),
  ];
};
