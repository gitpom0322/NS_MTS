const { ref, reactive, watch, computed, nextTick, onMounted } = Vue;
const { mapState } = Pinia;

import { useMessagesStore } from '../../stores/messagesStore.js'; //載入 Pinia Store

export const topTpl = {
  setup() {

    const messagesStore = useMessagesStore(); // 使用 Pinia Store

    const msgTatal = ref(0); // 確保 msgTatal 是 ref
    const templateContent = ref(''); // 用於存儲 fetch 獲取的內容
    const templateContainer = ref(null); // 定義 templateContainer

    // console.log('totalMessages:', messagesStore.totalMessages);

    // msgTatal.value = messagesStore.totalMessages; // 通知總數

    console.log('refList:', messagesStore.refList);


    // 在組件掛載時獲取訊息
    const doNotifiMsg_Show = async (title, body, event) => {
      await messagesStore.doNotifiMsg_Show(title, body, event);
    };
   
  
    
    // 初始化
    onMounted(async () => {

      await messagesStore.doNotifiList(); // 然後執行通知列表的初始化
      //await fetchTemplate(); // 確保模板先加載

      // 在通知列表更新後重新編譯模板
      // nextTick(() => {
      //   if (templateContainer.value) {
      //     compileTemplate(templateContainer.value);
      //   } else {
      //     console.error('templateContainer is null');
      //   }
      // });
      
      //console.log('refList after doNotifiList:', messagesStore.refList);
    });

    return {
      msgTatal: computed(() => messagesStore.msgTatal), // 將 msgTatal 暴露給模板
      refList: computed(() => messagesStore.refList.value), // 確保 refList 是響應式的
      // templateContainer ,
      doNotifiMsg_Show: messagesStore.doNotifiMsg_Show, // 方法暴露給模板
    };
  },
  template: `
<link rel="stylesheet" href="./www/tpls/default/top.css">

<!-- BEGIN scroll-top-btn -->
<a href="javascript:;" class="btn btn-icon btn-circle btn-success btn-scroll-to-top" data-toggle="scroll-to-top"><i class="fa fa-angle-up"></i></a>

<!-- BEGIN #header -->
<div id="header" class="app-header">
    <!-- BEGIN navbar-header -->
    <div class="navbar-header">
        <a href="index.html" class="navbar-brand"><span class="navbar-logo"></span> <b>NS MTS 系統</b> </a>
        <button type="button" class="navbar-mobile-toggler" data-toggle="app-sidebar-mobile">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
        </button>
    </div>
    <!-- END navbar-header -->


    <!-- BEGIN header-nav -->
    <div class="navbar-nav">
        <div class="navbar-item navbar-form">
        </div>


        <div class="navbar-item dropdown">
            <a href="#" data-bs-toggle="dropdown" class="navbar-link dropdown-toggle icon">
                <i class="fa fa-bell"></i>
                <span class="badge">{{msgTatal}}</span>
            </a>
            <div class="dropdown-menu media-list dropdown-menu-end" id="div-messages">
                <div class="dropdown-header">訊息通知 ({{msgTatal}})</div>     


                <a href="javascript:;" class="dropdown-item media" @click="doNotifiMsg_Show(d.title, d.msg, $event);"
                 v-for="(d, index) in refList" :key="index" :data-rowid="d.rowid">
                    <div class="media-left">
                        <i class="fa fa-envelope media-object bg-gray-500"></i>
                        <i class="fab fa-google text-warning media-object-icon fs-14px"></i>
                    </div>
                    <div class="media-body">
                        <h6 class="media-heading">{{ d.title }}</h6>
                        <p>{{ d.msg }}</p>
                        <div class="text-muted fs-10px">2 hour ago</div>
                    </div>
                </a>

                <div class="dropdown-footer text-center">
                    <a href="javascript:;" class="text-decoration-none" >View more</a>
                </div>
            </div>
        </div>
        
        <div class="navbar-item navbar-user dropdown">
            
            <a href="#" class="navbar-link dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
                <!-- <img src="/src/images/allen01.jpg" alt="" />  -->
                <span>
                    <span class="d-none d-md-inline">系統設定</span>
                    <b class="caret"></b>
                </span>
            </a>
            

            <div class="dropdown-menu dropdown-menu-end me-1">
                <div class="dropdown-divider"></div>
                <a href="login.html" class="dropdown-item">Log Out</a>
            </div>
        </div>
    </div>
    <!-- END header-nav -->
</div>
<!-- END #header -->
  `,
};