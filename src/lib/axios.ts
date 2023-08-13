import Axios from 'axios';
import qs from 'qs';

const baseURL = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;

export const paramsSerializer = <T>(params: T) => {
  return qs.stringify(params, { arrayFormat: 'repeat' });
};

export const axios = Axios.create({ baseURL });
