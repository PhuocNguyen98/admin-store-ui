import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token = localStorage.getItem('access_token');
    config.headers.Authorization = token ? `Bearer ${token}` : '';
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    if (response && response?.data) return response.data;
    return response;
  },
  async function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    if (error.response.status === 401) {
      try {
        const newAccessToken = await refreshToken();
        if (!newAccessToken) {
          localStorage.removeItem('access_token');
          window.location.href = `/login`;
        } else {
          localStorage.setItem('access_token', newAccessToken);
        }
      } catch (error) {
        localStorage.removeItem('access_token');
        window.location.href = `/login`;
      }
    }

    if (error && error.response?.data) return Promise.reject(error.response.data);
    return Promise.reject(error);
  },
);

async function refreshToken() {
  try {
    const res = await axiosInstance.post('/account/refreshToken', {
      token: localStorage.getItem('access_token'),
    });
    if (res?.data.status === 200 && res?.data?.refreshToken) {
      return res?.data?.refreshToken;
    } else {
      console.log(res?.data?.message);
      return null;
    }
  } catch (error) {
    console.log(error.message);
  }
}

const get = async (path, object) => (await axiosInstance.get(path, object)).data;

const post = async (path, object) => (await axiosInstance.post(path, object)).data;

const put = async (path, object) => (await axiosInstance.put(path, object)).data;

const deleted = async (path) => (await axiosInstance.delete(path)).data;

export const baseApi = {
  get,
  post,
  put,
  deleted,
};
