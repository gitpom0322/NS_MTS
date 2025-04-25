const { ref, reactive, watch, computed, nextTick, onMounted } = Vue;
import { useMessagesStore } from '../../stores/messagesStore.js'; //載入 Pinia Store

export const topTpl = {
  setup() {

    const messagesStore = useMessagesStore(); // 使用 Pinia Store

    const msgTatal = ref(0); // 確保 msgTatal 是 ref
    msgTatal.value = messagesStore.msgTatal; // 通知總數
    //console.log('msgTatal3:', msgTatal); // 確保 msgTatal 是 ref

    const templateContent = ref(''); // 用於存儲 fetch 獲取的內容s
    const refList = ref([]); // 通知列表
    // const notificationResult = ref(''); // 通知結果
    const templateContainer = ref(null); // 定義 templateContainer


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
          msgTatal,
          refList,
        }),
        methods: {
          doNotifiList,
          doNotifiMsg_Show,
      
        },
        render: compiled.render,
        staticRenderFns: compiled.staticRenderFns,
      };
      Vue.createApp(component).mount(container);
    };

    
    // 獲取通知列表
    const doNotifiList = () => {
      const userData = libUserData_Get();
      const params = {
        uid: userData.uid,
      };

      window.electron.ipcRenderer
        .invoke('MessageLog_Get', params)
        .then((response) => {
          const { totalCount, data } = response;
          msgTatal.value = totalCount;
          refList.value = data;
          
          console.log('MessageLog_Get:', data);
        })
        .catch((error) => {
          console.error('Error MessageLog_Get:', error);
        });
    };


    
    // 初始化
    onMounted(async () => {
      await fetchTemplate(); // 確保模板先加載
      await doNotifiList(); // 然後執行通知列表的初始化
    });

    return {
      msgTatal,
      refList,
      // notificationResult,
      templateContainer,
      fetchTemplate,
      doNotifiMsg_Show, // 將方法暴露給模板
    };
  },
  template: `
    <div>
      <div ref="templateContainer"></div>
    </div>
  `,
};