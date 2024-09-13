import { baseApi } from '~/utils/axios';

export const getDiscountApi = async (order, sort, page, limit, search) => {
  let url = `/discount`;

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
