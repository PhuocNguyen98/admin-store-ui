import config from '~/config';

import Login from '~/pages/Auth/Login';
import Logout from '~/pages/Auth/Logout';
import Dashboard from '~/pages/Dashboard';
import Category from '~/pages/Category';
import CategoryForm from '~/pages/Category/CategoryForm';
import CategoryFormEdit from '~/pages/Category/CategoryFormEdit';

// routes need login
export const privateRoutes = [
  { path: config.routes.logout, component: Logout, layout: null },
  { path: config.routes.dashboard, component: Dashboard },
  { path: config.routes.category, component: Category },
  { path: config.category.add, component: CategoryForm },
  { path: config.category.edit, component: CategoryFormEdit },
];

//routes not login
export const publicRoutes = [
  { path: config.routes.login, component: Login, layout: null },
];
