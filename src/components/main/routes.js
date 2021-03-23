import Overview from './read/overview/Overview.vue';
import Products from './read/products/Products.vue';
import Users from './read/users/Users.vue';
import Orders from './read/orders/Orders.vue';

import CreateProduct from './create/product/index.vue';

import UpdateProduct from './update/product/index.vue';
import UpdateProfile from './update/profile/index.vue';


export default [
  {
    path: 'overview',
    name: 'Overview',
    component: Overview,
  },
  {
    path: 'product/create',
    name: 'Criar produto',
    component: CreateProduct,
  },
  {
    path: 'products',
    name: 'Produtos',
    component: Products,
  },
  {
    path: 'products/update/:id',
    name: 'Editar produto',
    component: UpdateProduct,
  },
  {
    path: 'profile/update',
    name: 'Editar usuário',
    component: UpdateProfile,
  },

  {
    path: 'orders',
    name: 'Pedidos',
    component: Orders,
  },
  {
    path: 'users',
    name: 'Usuários',
    component: Users,
  },
];
