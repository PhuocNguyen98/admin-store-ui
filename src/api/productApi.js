import { baseApi } from '~/utils/axios';

export const getProductApi = async (search, sort, order, page, limit) => {
  let url = `/product?search=${search}&sort=${sort}&order=${order}&page=${page}&limit=${limit}`;
  const res = await baseApi.get(url);
  return res;
};

export const getProductByIdApi = async (id) => {
  const res = await baseApi.get(`/product/${id}`);
  return res;
};

export const addProductApi = async (data) => {
  const res = await baseApi.post('/product', data);
  return res;
};

export const updateProductApi = async (id, data) => {
  const res = await baseApi.put(`/product/${id}`, data);
  return res;
};

export const quickUpdateProductApi = async (data) => {
  const res = await baseApi.put(`/product`, data);
  return res;
};
