import { baseApi } from '~/utils/axios';

export const getSupplierApi = async (search, sort, order, page, limit) => {
  let url = `/supplier?search=${search}&sort=${sort}&order=${order}&page=${page}&limit=${limit}`;
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

export const quickUpdateSupplierApi = async (data) => {
  const res = await baseApi.put(`/supplier`, data);
  return res;
};
