// import { createRouter, createWebHashHistory } from 'https://unpkg.com/vue-router@4/dist/vue-router.global.js';
import Home from '../views/Home.js';
//import Users from './views/users/list.js';

// const Home = { template: '<div>Home Page</div>' };
const Admin = { template: '<div>Admin Page</div>' };
// const List3 = { template: '<div>List3 Page</div>' };

const routes = [
  { path: '/', component: Home },
  { path: '/messages_center', component: () => import('../views/messages/list.js') },
  // { path: '/admin', component: Admin },
  { path: '/list3', component: () => import('../views/users/list.js') }, // 動態載入 Users 組件
  { path: '/car_chicken', component: () => import('../views/car_chicken_t/list.js') },
  { path: '/car_chicken_new', component: () => import('../views/car_chicken/list.js') },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
});

export default router;