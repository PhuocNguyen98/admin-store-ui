import { useState } from 'react';

export default function useToken() {
  const getAuth = () => {
    const tokenString = localStorage.getItem('token');
    const userAuth = JSON.parse(tokenString);
    return userAuth;
  };

  const getToken = () => {
    const userToken = getAuth();
    return userToken?.token;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    localStorage.setItem('token', JSON.stringify(userToken));
    setToken(userToken.token);
  };

  const clearToken = () => {
    localStorage.removeItem('token');
  };

  return {
    getAuth,
    token,
    setToken: saveToken,
    clearToken,
  };
}
