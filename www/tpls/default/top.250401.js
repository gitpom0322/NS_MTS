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

    // 獲取模板
    const fetchTemplate = async () => {
      try {
        const response = await fetch('./www/tpls/default/top.html');
        if (response.ok) {
          const text = await response.text();
          templateContent.value = text;

          // 確保 DOM 已更新
          await nextTick();

          if (templateContainer.value) {
            templateContainer.value.innerHTML = templateContent.value;
            compileTemplate(templateContainer.value);
          } else {
            console.error('templateContainer is null');
          }
        } else {
          console.error('HTTP error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    // 編譯模板
    const compileTemplate = (container) => {
      const compiled = Vue.compile(container.innerHTML);
      const component = {
        data: () => ({
          msgTatal:messagesStore.msgTatal, // 通知總數
          refList: messagesStore.refList.value, // 確保使用 refList 的值
        }),
        methods: {
          doNotifiList: messagesStore.doNotifiList, // 將 messagesStore.doNotifiList 傳遞到 methods
          doNotifiMsg_Show,
      
        },
        render: compiled.render,
        staticRenderFns: compiled.staticRenderFns,
      };
      Vue.createApp(component).mount(container);
    };
  
    
    // 初始化
    onMounted(async () => {

      await messagesStore.doNotifiList(); // 然後執行通知列表的初始化
      await fetchTemplate(); // 確保模板先加載

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
      msgTatal,
      refList: messagesStore.refList.value,
      templateContainer ,
      doNotifiMsg_Show,
    };
  },
  template: `
    <div>
      <div ref="templateContainer"></div>
    </div>
  `,
};