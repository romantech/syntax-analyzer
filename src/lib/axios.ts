import Axios from 'axios';
import { stringify } from 'qs';

const baseURL = import.meta.env.DEV
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;

export const paramsSerializer = <T>(params: T) => {
  return stringify(params, { arrayFormat: 'repeat' });
};

export const axios = Axios.create({ baseURL });
