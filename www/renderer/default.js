const { createApp, defineAsyncComponent } = Vue;

import router  from '../router/default.js';  //router會導致左方失效

// 定義組件模板
import { topTpl } from '../tpls/default/top.js';
import { leftTpl } from '../tpls/default/leftMenu.js';
// import { footerTpl } from '../tpls/default/footer.js';

// 動態載入 leftTpl 組件
// const LeftSection = defineAsyncComponent(() =>
//   import('./tpls/leftMenu.js').then(module => module.leftTpl)
// );

let appVueParams = {
  template: `
    <div>
      <top-section></top-section>
      <left-section></left-section>
      <div id="content" class="app-content">
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
// appVue.component('footer-section', footerTpl);


// 設置 Vue 應用的配置來隱藏警告訊息
appVue.config.warnHandler = function (msg, vm, trace) {
  // 忽略警告訊息
};
// appVue.config.silent = true;

appVue.use(router);
appVue.mount('#app');



$(document).ready(function() {
    
  // alert('Hello from jQuery!');

});