import express from 'express';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import path, { dirname } from 'path';
import { terminate } from './helpers/error.js';
import OHCLVRouter from './api/routes/ohlcvRoute.js';
import { updateOHLCVFile } from './helpers/ohlcv_helpers.js';

export const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const server = http.Server(app);
export const io = new Server(server);

io.on('connection', (socket) => {
  console.log('user is conneted');
});

const PORT = process.env.PORT || 80;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use(express.static(path.join(__dirname, 'views')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const errorHandler = terminate(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.use('/ohlcv', OHCLVRouter);

process.on('uncaughtException', errorHandler(1, 'Unexpected Error')); //programmer error
process.on('unhandledRejection', errorHandler(1, 'Unhandled Promise')); //unhandled promise error
process.on('SIGTERM', errorHandler(0, 'SIGTERM')); //on a successful termination
process.on('SIGINT', errorHandler(0, 'SIGINT')); //interrupted process

app.use((err, res, next) => {
  return res.status(400).json({ success: false, message: 'route not found' });
});

updateOHLCVFile('ADA');
updateOHLCVFile('XRP');
updateOHLCVFile('MATIC');

//put in a function that takes array of crypto curriencies and just loop through
//create constants for the cryptos
