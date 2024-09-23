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

  const saveToken = (userToken) => {
    localStorage.setItem('access_token', userToken);
    setToken(userToken);
  };

  const clearToken = () => {
    localStorage.removeItem('access_token');
  };

  return {
    getAuth,
    token,
    setToken: saveToken,
    clearToken,
  };
}
