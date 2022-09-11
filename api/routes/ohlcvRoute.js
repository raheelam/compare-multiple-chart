import { Router } from 'express';

import {
  getOHLCVFileDataController,
  addOHLCVFileController,
} from '../controllers/ohlcvController.js';

const router = Router();
router.get('/:name', getOHLCVFileDataController);
router.get('/add/:name', addOHLCVFileController); //TO DO: change to post

export default router;
