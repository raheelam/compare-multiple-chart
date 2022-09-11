import axios from 'axios';

export const axiosCoinApiInstance = axios.create({
  baseURL: 'https://rest.coinapi.io',
  headers: { 'X-CoinAPI-Key': 'AE3A4762-B5D9-497B-BB94-60BB3E3E3BFD' },
});
