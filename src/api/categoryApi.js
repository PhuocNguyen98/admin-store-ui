import { baseApi } from '~/utils/axios';

export const getCategoryApi = async (order, sort, page, limit, search) => {
  let url = `/category?order=${order}&sort=${sort}&page=${page}&limit=${limit}`;
  if (search) {
    url += `&search=${search}`;
  }
  const res = await baseApi.get(url);
  return res;
};

export const addCategoryApi = async (data) => {
  const res = await baseApi.post('/category', data);
  return res;
};
