import { baseApi } from '~/utils/axios';

export const getSupplierApi = async (order, sort, page, limit, search) => {
  let url = `/supplier?order=${order}&sort=${sort}&page=${page}&limit=${limit}`;
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
  const res = await baseApi.post(`/supplier/${id}`, data);
  return res;
};
