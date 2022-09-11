import { Router } from 'express';

import {
  getOHLCVFileDataController,
  addOHLCVFileController,
  updateOHLCVFileController,
} from '../controllers/ohlcvController.js';

const router = Router();
router.get('/:name', getOHLCVFileDataController);
router.post('/add/:name', addOHLCVFileController);
router.post('/update/:name', updateOHLCVFileController);

export default router;
