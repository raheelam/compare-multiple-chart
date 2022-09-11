import { axiosCoinApiInstance } from './axios_helpers.js';
import { errorHandler } from './error.js';

export const getData = async (url, axiosConfig) => {
  try {
    const { data } = await axiosCoinApiInstance.get(url, axiosConfig);
    return data;
  } catch (err) {
    return errorHandler('', err);
  }
};
