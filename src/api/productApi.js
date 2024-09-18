import { baseApi } from '~/utils/axios';

export const getProductApi = async (order, sort, page, limit, search) => {
  let url = `/product?order=${order}&sort=${sort}&page=${page}&limit=${limit}`;
  if (search) {
    url += `&search=${search}`;
  }
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
