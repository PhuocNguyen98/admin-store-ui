import { baseApi } from '~/utils/axios';

export const loginUser = async (data) => {
  const res = await baseApi.post('/login', data);
  return res;
};
