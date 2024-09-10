import config from '~/config';

import Login from '~/pages/Auth/Login';
import Logout from '~/pages/Auth/Logout';
import Dashboard from '~/pages/Dashboard';

//Category
import Category from '~/pages/Category';
import CategoryForm from '~/pages/Category/CategoryForm';

// Supplier
import Supplier from '~/pages/Supplier';
import SupplierForm from '~/pages/Supplier/SupplierForm';

// Discount
import Discount from '~/pages/Discount';
import DiscountForm from '~/pages/Discount/DiscountForm';

// routes need login
export const privateRoutes = [
  { path: config.routes.logout, component: Logout, layout: null },
  { path: config.routes.dashboard, component: Dashboard },
  // Category
  { path: config.routes.category, component: Category },
  { path: config.category.add, component: CategoryForm },
  { path: config.category.edit, component: CategoryForm },

  // Supplier
  { path: config.routes.supplier, component: Supplier },
  { path: config.supplier.add, component: SupplierForm },
  { path: config.supplier.edit, component: SupplierForm },

  // Discount
  { path: config.routes.discount, component: Discount },
  { path: config.discount.add, component: DiscountForm },
  { path: config.discount.edit, component: DiscountForm },
];

//routes not login
export const publicRoutes = [
  { path: config.routes.login, component: Login, layout: null },
];
