import { baseApi } from '~/utils/axios';

// Staff
export const getStaffApi = async (search, sort, order, page, limit) => {
  let url = `/staff?search=${search}&sort=${sort}&order=${order}&page=${page}&limit=${limit}`;
  const res = await baseApi.get(url);
  return res;
};

export const getStaffByIdApi = async (id) => {
  const res = await baseApi.get(`/staff/${id}`);
  return res;
};

export const getStaffProfileApi = async () => {
  const res = await baseApi.get(`/staff/profile`);
  return res;
};

export const addStaffAccountApi = async (data) => {
  const res = await baseApi.post('/staff/account', data);
  return res;
};

export const updateStaffAccountApi = async (data) => {
  const res = await baseApi.put(`/staff/account`, data);
  return res;
};
