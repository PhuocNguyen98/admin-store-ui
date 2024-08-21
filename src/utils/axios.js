import { setupInterceptorsTo } from './httpClient';
import axios from 'axios';

export const axiosInstance = setupInterceptorsTo(
  axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
  }),
);

const get = async (path, object) =>
  (await axiosInstance.get(path, object)).data;

const post = async (path, object) =>
  (await axiosInstance.post(path, object)).data;

const put = async (path, object) =>
  (await axiosInstance.put(path, object)).data;

const deleted = async (path) => (await axiosInstance.delete(path)).data;

export const baseApi = {
  get,
  post,
  put,
  deleted,
};
