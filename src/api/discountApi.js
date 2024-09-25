import { baseApi } from '~/utils/axios';

export const getDiscountApi = async (search, sort, order, page, limit) => {
  let url = `/discount?search=${search}&sort=${sort}&order=${order}&page=${page}&limit=${limit}`;
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

export const quickUpdateDiscountApi = async (data) => {
  const res = await baseApi.put(`/discount`, data);
  return res;
};
