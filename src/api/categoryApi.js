import { baseApi } from '~/utils/axios';

export const addCategory = async (data) => {
  const res = await baseApi.post('/category', data);
  return res;
};
