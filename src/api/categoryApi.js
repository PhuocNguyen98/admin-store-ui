import { baseApi } from '~/utils/axios';

export const addCategoryApi = async (data) => {
  const res = await baseApi.post('/category', data);
  return res;
};
