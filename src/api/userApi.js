import { baseApi } from '~/utils/axios';

export const getUserProfileApi = async () => {
  const res = await baseApi.get(`/user/profile`);
  return res;
};

export const updateUserProfileApi = async (data) => {
  const res = await baseApi.put(`/user/profile`, data);
  return res;
};

export const changeUserPasswordApi = async (data) => {
  const res = await baseApi.put(`/user/profile/change/password`, data);
  return res;
};
