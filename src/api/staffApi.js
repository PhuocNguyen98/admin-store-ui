import { baseApi } from '~/utils/axios';

// Staff
export const getStaffApi = async (order, sort, page, limit, search) => {
  let url = `/staff`;

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

export const getStaffByIdApi = async (id) => {
  const res = await baseApi.get(`/staff/${id}`);
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
