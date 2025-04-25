
const { ref, reactive, watch, computed, nextTick, onMounted } = Vue;
const { defineStore } = Pinia;


export const useMessagesStore = defineStore('messagesStore', {
  state: () => ({
    messages: [], // 儲存訊息的陣列
    totalMessages: 10, // 總訊息數量
    msgTatal: 0, // 通知總數
    refList: ref([]), // 通知列表
    tsUid: ref([]), // 使用者id

    refGroupList: ref([]), // 訊息群組列表
    
    notificationResult: '', // 通知結果
  }),

  actions: {
    // 顯示通知
    doNotifiMsg_Show(title, body, event) {
      // 阻止事件冒泡，防止 dropdown 自動關閉
      if (event) {
        event.stopPropagation();
      }


      // 將換行符號 (\n) 替換為 <br />
      const new_body = body.replace(/\n/g, '<br />');

      // 調用 Electron 的通知功能
      if (window.electron && window.electron.customNotification) {
        window.electron.customNotification.show(title, new_body);
        this.notificationResult = '通知已發送成功！'; // 更新通知結果
      
        const rowid = event.currentTarget.dataset.rowid;
        console.log('rowid:', rowid); // 獲取 rowid

        // 更新通知狀態，並在完成後重新獲取通知列表
        this.doNotificationIsRead_Upd(rowid)
          .then(() => {
            this.doNotifiList(); // 重新獲取通知列表
            this.doMessagesGroupList_Get(); // 重新獲取訊息群組列表
          })
          .catch((error) => {
            console.error('更新通知狀態失敗:', error);
          });
      } else {
        this.notificationResult = '通知功能不可用！'; // 更新通知結果
        console.error('Electron notification API 不可用');
      }
    },

    // 更新通知為已讀
    doNotificationIsRead_Upd(rowid) {
      return new Promise((resolve, reject) => {
        const rowData = {
          rowid: rowid,
          isread: 1, // 設置為已讀
        };

        window.electron.ipcRenderer
          .invoke('MessageLog_Upd', rowData)
          .then((response) => {
            if (response.success) {
              console.log('更新成功，影響的列數:', response.affectedRows);
              resolve();
            } else {
              console.error('更新失敗:', response.error);
              reject(response.error);
            }
          })
          .catch((error) => {
            console.error('IPC 調用錯誤:', error);
            reject(error);
          });
      });
    },

    // 獲取通知列表
    doNotifiList() {
      const userData = libUserData_Get();

      this.tsUid.value = userData.uid; // 使用者id
      const params = {
        uid: userData.uid,
      };

      window.electron.ipcRenderer
        .invoke('MessageLog_Get', params)
        .then((response) => {
          const { totalCount, data } = response;
          this.msgTatal = totalCount;
          this.refList.value = data;
          console.log('MessageLog_Get3:', data);
        })
        .catch((error) => {
          console.error('Error MessageLog_Get:', error);
        });
    },


    //取得訊息群組
    doMessagesGroupList_Get() {

      const userData = libUserData_Get();
      const params = {
        uid: userData.uid,
      };
      
      // tsUid.value = userData.uid; //使用者id


      // 查詢所有 Users
      window.electron.ipcRenderer.invoke('MessageLogGroup_Get', params)
        .then(response => {
            const { totalCount, data } = response;

            // console.log('response:', response);
            // console.log(`Total: ${totalCount}`); // 記錄總筆數
            //setPages.dataCount = totalCount;
            this.refGroupList.value = data; // 更新 users 變數
            
            // 移除所選的列資料
            // nsTableSet.value.doTsRow_remove();
        })
        .catch(error => {
          console.error('Error MessageLogGroup_Get:', error);
        });

      },

    // 刪除訊息
    deleteMessage(id) {
      this.messages = this.messages.filter((message) => message.id !== id);
      this.totalMessages = this.messages.length;
    },
  },
});