import { baseApi } from '~/utils/axios';

export const loginStaff = async (data) => {
  const res = await baseApi.post('/login', data);
  return res;
};

export const getAccountStaff = async () => {
  const res = await baseApi.get('/account');
  return res;
};

export const logoutStaff = async () => {
  const res = await baseApi.get('/account/logout');
  return res;
};
