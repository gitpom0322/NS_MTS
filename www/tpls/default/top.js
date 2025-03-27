// filepath: /d:/NB/公司/SourceCode/專案/js/electron/t01/e01/www/tpls/top.js
const { ref, reactive, watch, computed, nextTick } = Vue;

export const topTpl = {
  data() {
    return {
      datab: '123',
      msgTatal: 0,
      templateContent: '', // 用於存儲 fetch 獲取的內容
      refList : ref([]),
    };
  },
  methods: {
    dotop() {
      alert('dotop');
    },

    doNotifiMsg_Show(title, body) { 

        // 將換行符號 (\n) 替換為 <br />
        let new_body = body.replace(/\n/g, '<br />');

        // 調用 Electron 的通知功能
        if (window.electron && window.electron.customNotification) {
            window.electron.customNotification.show(title, new_body);
            this.notificationResult = '通知已發送成功！'; // 更新通知結果
        } else {
            this.notificationResult = '通知功能不可用！'; // 更新通知結果
            console.error('Electron notification API 不可用');
        }

    },

    // 定義一個延遲函式
    doDelay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },

    doNotifiMsg_Send(total, data) {

        console.log('total:', total);
        console.log('data:', data);
        
        this.msgTatal = total;
        // 定義一個異步函式來處理逐條通知
        const sendNotifications = async () => {
            for (let index = 0; index < data.length; index++) {
                const item = data[index];
                //console.log(`第 ${index + 1} 筆資料:`, item);

                // 顯示通知
                this.doNotifiMsg_Show(item.title, item.msg);

                // 等待 1 秒
                await this.doDelay(1000);
            }
      };

        // 調用異步函式
        sendNotifications();

    },

    doNotification() {

        const userData = libUserData_Get();
        console.log('userData:', userData);

        let params = {
            uid: userData.uid,
        };

        // 查詢所有 Users
        window.electron.ipcRenderer.invoke('MessageLog_Get', params)
        .then(response => {
            const { totalCount, data } = response;
            //console.log('MessageLog_Get:', data);
            //console.log(`Total: ${totalCount}`); // 記錄總筆數
            this.doNotifiMsg_Send(totalCount, data);
        })
        .catch(error => {
            console.error('Error MessageLog_Get:', error);
        });

    },



    doNotifiList() {

      const userData = libUserData_Get();
      let params = {
          uid: userData.uid,
      };

      // 查詢所有 Users
      window.electron.ipcRenderer.invoke('MessageLog_Get', params)
      .then(response => {
          const { totalCount, data } = response;
          this.msgTatal = totalCount;

          console.log('MessageLog_Get:', data);
          this.refList.value = data;
      })
      .catch(error => {
          console.error('Error MessageLog_Get:', error);
      });

  },

    //獲取模板的方法
    async fetchTemplate() {
      try {
        const response = await fetch('./www/tpls/default/top.html');
        // console.log('Response:', response);

        // 確保 response.ok 為 true
        if (response.ok) {
          const text = await response.text();
        //   console.log('Response Text:', text);
          this.templateContent = text; // 將獲取到的內容設置到 data 中
          await nextTick();
          this.$refs.templateContainer.innerHTML = this.templateContent;
          this.compileTemplate();
        } else {
          console.error('HTTP error:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    },

    // 編譯模板的方法
    compileTemplate() {
      const container = this.$refs.templateContainer;
      const compiled = Vue.compile(container.innerHTML);
      const component = {
        data: () => ({
            msgTatal: this.msgTatal,
            notificationResult: this.notificationResult, // 確保模板可以訪問 notificationResult
            refList: this.refList.value // 傳遞 refList 到模板
        }),
        methods: { // 確保模板可以訪問 showNotification 方法
          doNotification: this.doNotification,
          doNotifiList: this.doNotifiList,
          doNotifiMsg_Send: this.doNotifiMsg_Send,
          doNotifiMsg_Show: this.doNotifiMsg_Show
        },
        render: compiled.render,
        staticRenderFns: compiled.staticRenderFns
      };
      Vue.createApp(component).mount(container);
    }
  },
  async mounted() {
    // 初始化
    this.doNotifiList();
    await this.fetchTemplate();
  },
  template: `
    <div>
      <div ref="templateContainer"></div>
    </div>
  `
};