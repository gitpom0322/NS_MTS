// filepath: /d:/NB/公司/SourceCode/專案/js/electron/t01/e01/www/tpls/leftMenu.js
const { ref, onMounted, defineAsyncComponent } = Vue;

export const leftTpl = {
  setup() {
    const dataA = ref('abc');

    function createWindow() {
      window.electron.ipcRenderer.send('open-new-window');
    }

    onMounted(() => {
      // 初始化
      console.log('init dataA:', dataA.value);
    });

    return {
      dataA,
      createWindow
    };
  },
  template: `
    <div id="data-menu-link"></div>

    <div id="sidebar" class="app-sidebar">
      <!-- BEGIN scrollbar -->
      <div class="app-sidebar-content" data-scrollbar="true" data-height="100%">
        <!-- BEGIN menu -->
        <div class="menu">
          <div class="menu-profile">
            <a href="javascript:;" class="menu-profile-link" data-toggle="app-sidebar-profile" data-target="#appSidebarProfileMenu">
              <div class="menu-profile-cover with-shadow"></div>
              <div class="menu-profile-image">
                <!-- <img src="/src/assets/img/user/stetv.jpg" alt="" /> -->
                <img src="https://app.non-sheng.com.tw/res/images/fav.ico" alt="" />
              </div>
              <div class="menu-profile-info">
                <div class="d-flex align-items-center">
                  <div class="flex-grow-1">
                    xxxxxxxxx
                  </div>
                  <div class="menu-caret ms-auto"></div>
                </div>
                <!-- <small>Frontend developer</small> -->
              </div>
            </a>
          </div>
          
          <div class="menu-header">功能列表</div>
          <div class="menu-item has-sub active">
            <a href="javascript:;" class="menu-link">
              <div class="menu-icon">
                <i class="fa fa-sitemap"></i>
              </div>
              <div class="menu-text">功能選單</div>
              <div class="menu-caret"></div>
            </a>
            <div class="menu-submenu">
              <div class="menu-item">
                <a href="index.html" class="menu-link"><RouterLink to="/">首頁</RouterLink></a>
              </div>
              <div class="menu-item active">
                <a href="index.html" class="menu-link"><RouterLink to="/admin">admin頁</RouterLink></a>
              </div>
              <div class="menu-item">
                <a href="index.html" class="menu-link"><RouterLink to="/list3">list3頁</RouterLink></a>
              </div>
              <div class="menu-item">
                <a href="index.html" class="menu-link"><RouterLink to="/car_chicken">跟車雞</RouterLink></a>
              </div>
              <div class="menu-item">
                <a href="javascript:;" class="menu-link"><RouterLink to="/">其它-{{dataA}}</RouterLink></a>
              </div>
            </div>
          </div>
          
          <div class="menu-item d-flex">
            <a href="javascript:;" class="app-sidebar-minify-btn ms-auto d-flex align-items-center text-decoration-none" 
              data-toggle="app-sidebar-minify"><i class="fa fa-angle-double-left"></i></a>
          </div>
        </div>
        <!-- END menu -->
      </div>
      <!-- END scrollbar -->
    </div>
  `
};