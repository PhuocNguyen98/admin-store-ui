import useToken from '~/hooks/useToken';
import { useEffect } from 'react';

import config from '~/config';

import { logoutStaff } from '~/api/authApi';

function Logout() {
  const { clearToken } = useToken();

  const handleLogout = async () => {
    try {
      const res = await logoutStaff();
      console.log(res);
      if (res?.status === 200) {
        clearToken();
        window.location.href = config.routes.login;
      }
    } catch (error) {
      // console.log(error);
    }
  };

  useEffect(() => {
    handleLogout();
  }, []);

  return <></>;
}

export default Logout;
