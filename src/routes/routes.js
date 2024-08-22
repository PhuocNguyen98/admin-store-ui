import config from '~/config';

import Login from '~/pages/Auth/Login';
import Logout from '~/pages/Auth/Logout';
import Dashboard from '~/pages/Dashboard';
import Category from '~/pages/Category';

// routes need login
export const privateRoutes = [
  { path: config.routes.logout, component: Logout, layout: null },
  { path: config.routes.dashboard, component: Dashboard },
  { path: config.routes.category, component: Category },
];

//routes not login
export const publicRoutes = [
  { path: config.routes.login, component: Login, layout: null },
];
