import { baseApi } from '~/utils/axios';

export const getCategoryApi = async (search, sort, order, page, limit) => {
  let url = `/category?search=${search}&sort=${sort}&order=${order}&page=${page}&limit=${limit}`;
  const res = await baseApi.get(url);
  return res;
};

export const getCategoryByIdApi = async (id) => {
  const res = await baseApi.get(`/category/${id}`);
  return res;
};

export const addCategoryApi = async (data) => {
  const res = await baseApi.post('/category', data);
  return res;
};

export const updateCategoryApi = async (id, data) => {
  const res = await baseApi.put(`/category/${id}`, data);
  return res;
};

export const quickUpdateCategoryApi = async (data) => {
  const res = await baseApi.put(`/category`, data);
  return res;
};
