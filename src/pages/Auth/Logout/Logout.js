import useToken from '~/hooks/useToken';
import { useEffect } from 'react';

import config from '~/config';

function Logout() {
  const { clearToken } = useToken();

  const handleLogout = () => {
    clearToken();
    window.location.pathname = config.routes.login;
  };

  useEffect(() => {
    handleLogout();
  }, []);
  return <></>;
}

export default Logout;
