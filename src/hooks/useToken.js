import { useState } from 'react';

export default function useToken() {
  const getAuth = () => {
    return localStorage.getItem('access_token');
  };

  const getToken = () => {
    const userToken = getAuth();
    return userToken;
  };

  const [token, setToken] = useState(getToken());
  const [refreshToken, setRefreshToken] = useState('');

  const saveToken = (userToken) => {
    localStorage.setItem('access_token', userToken?.access_token);
    setToken(userToken?.access_token);

    localStorage.setItem('refresh_token', userToken?.refresh_token);
    setRefreshToken(userToken?.refresh_token);
  };

  const clearToken = () => {
    localStorage.removeItem('access_token');
  };

  return {
    getAuth,
    token,
    refreshToken,
    setToken: saveToken,
    clearToken,
  };
}
