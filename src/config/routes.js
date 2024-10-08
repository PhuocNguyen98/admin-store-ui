const routes = {
  login: '/login',
  logout: '/logout',
  dashboard: '/dashboard',
  category: '/category',
  supplier: '/supplier',
  discount: '/discount',
  product: '/product',
  staff: '/staff',
  profile: '/profile',
};

export const category = {
  add: '/category/add',
  edit: '/category/edit/:id',
};

export const supplier = {
  add: '/supplier/add',
  edit: '/supplier/edit/:id',
};

export const discount = {
  add: '/discount/add',
  edit: '/discount/edit/:id',
};

export const product = {
  add: '/product/add',
  edit: '/product/edit/:id',
};

export const staff = {
  add: '/staff/add',
  view: '/staff/view/:id',
};

export default routes;
