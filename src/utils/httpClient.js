import {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
// import { messageCode } from '@/constants/message-code';
// import { notificationStore } from '@/stores/notification';

// const { open } = notificationStore;

const onRequest = (config) => config;

const onRequestError = (error) => Promise.reject(error);

const onResponse = (response) => response;

const onResponseError = (error) => {
  //   const message = messageCode[`${error.response?.status}`];
  //   message?.message && open(message.message, message.severity);
  return Promise.reject(error);
};

export function setupInterceptorsTo(axiosInstance) {
  //@ts-ignore
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}
