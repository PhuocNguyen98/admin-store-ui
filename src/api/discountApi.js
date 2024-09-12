import { baseApi } from '~/utils/axios';

export const getDiscountApi = async (order, sort, page, limit, search) => {
  let url = `/discount?order=${order}&sort=${sort}&page=${page}&limit=${limit}`;
  if (search) {
    url += `&search=${search}`;
  }
  const res = await baseApi.get(url);
  return res;
};

export const getDiscountByIdApi = async (id) => {
  const res = await baseApi.get(`/discount/${id}`);
  return res;
};

export const addDiscountApi = async (data) => {
  const res = await baseApi.post('/discount', data);
  return res;
};

export const updateDiscountApi = async (id, data) => {
  const res = await baseApi.put(`/discount/${id}`, data);
  return res;
};

export const updateDiscountStatusApi = async (data) => {
  const res = await baseApi.put(`/discount`, data);
  return res;
};
