import { baseApi } from '~/utils/axios';

export const getCategoryApi = async (order, sort, page, limit, search) => {
  let url = `/category`;

  if (order) {
    url += `?order=${order}`;
  }
  if (sort) {
    url += `&sort=${sort}`;
  }
  if (page) {
    url += `&page=${page}`;
  }
  if (limit) {
    url += `&limit=${limit}`;
  }
  if (search) {
    url += `&search=${search}`;
  }
  if (search) {
    url += `&search=${search}`;
  }

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
