import { baseApi } from '~/utils/axios';

export const getSupplierApi = async (order, sort, page, limit, search) => {
  let url = `/supplier`;

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

export const getSupplierByIdApi = async (id) => {
  const res = await baseApi.get(`/supplier/${id}`);
  return res;
};

export const addSupplierApi = async (data) => {
  const res = await baseApi.post('/supplier', data);
  return res;
};

export const updateSupplierApi = async (id, data) => {
  const res = await baseApi.put(`/supplier/${id}`, data);
  return res;
};
