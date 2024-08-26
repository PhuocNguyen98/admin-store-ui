import { baseApi } from '~/utils/axios';

export const getCategoryApi = async () => {
  const res = await baseApi.get('/category');
  return res;
};

export const addCategoryApi = async (data) => {
  const res = await baseApi.post('/category', data);
  return res;
};
