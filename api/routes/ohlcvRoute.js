import { Router } from 'express';
import { validateCryptoName } from '../../validations/addCryptoFileValidation.js';

import {
  getOHLCVFileDataController,
  createOHLCVFileController,
} from '../controllers/ohlcvController.js';

const router = Router();
router.get('/:name', getOHLCVFileDataController);
router.post('/create', validateCryptoName(), createOHLCVFileController);

export default router;
