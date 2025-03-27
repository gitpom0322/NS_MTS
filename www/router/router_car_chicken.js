// import { createRouter, createWebHashHistory } from 'https://unpkg.com/vue-router@4/dist/vue-router.global.js';

// const Home = { template: '<div>Home Page</div>' };
const Admin = { template: '<div>Admin Page</div>' };
// const List3 = { template: '<div>List3 Page</div>' };

const routes = [
  { path: '/', component: () => import('../views/car_chicken/gmap/list.js') }, // 動態載入 gmap 組件
  { path: '/car_manage', component: () => import('../views/car_chicken/car_manage/list.js') }, // 動態載入 gmap 組件
  { path: '/admin', component: Admin },
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
});

export default router;