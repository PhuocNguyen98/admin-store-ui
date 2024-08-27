import { baseApi } from '~/utils/axios';

export const getCategoryApi = async (order, sort, page, limit) => {
  const res = await baseApi.get(
    `/category?order=${order}&sort=${sort}&page=${page}&limit=${limit}`,
  );
  return res;
};

export const addCategoryApi = async (data) => {
  const res = await baseApi.post('/category', data);
  return res;
};
