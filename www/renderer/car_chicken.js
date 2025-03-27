const { createApp, defineAsyncComponent } = Vue;
// const { ipcRenderer } = require('electron');

import router  from '../router/router_car_chicken.js';  //router會導致左方失效

// 定義組件模板
import { topTpl } from '../tpls/car_chicken/top.js';
import { leftTpl } from '../tpls/car_chicken/leftMenu.js';

// 動態載入 leftTpl 組件
// const LeftSection = defineAsyncComponent(() =>
//   import('./tpls/leftMenu.js').then(module => module.leftTpl)
// );

//console.log('route', $route.params);

let appVueParams = {
  template: `
    <div>
      <top-section></top-section>
       <!-- BEGIN pos -->
        <div class="pos pos-customer" id="pos-customer">
            <left-section></left-section>
            <router-view></router-view>
        </div>
    </div>
  `
}

// console.log('leftTpl', leftTpl);

const appVue = createApp(appVueParams);

// appVue.component('left-section', {template: topTpl});
appVue.component('top-section', topTpl);
appVue.component('left-section', leftTpl);


// 設置 Vue 應用的配置來隱藏警告訊息
appVue.config.warnHandler = function (msg, vm, trace) {
  // 忽略警告訊息
};
// appVue.config.silent = true;

appVue.use(router);
appVue.mount('#app');






$(document).ready(function() {
    
    // alert('Hello from jQuery!');
    
   
    // 將 cmpid 設置為 Cookie，有效期 7 天
    //$.cookie('ns-cmpid', cmpid, { expires: 7, path: '/' });

    // 驗證 Cookie 是否設置成功
    //const cookieValue = $.cookie('ns-cmpid');


     // 設定公司id
     libCookieByCmpid_Set();


});