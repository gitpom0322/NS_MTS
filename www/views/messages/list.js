const { ref, reactive, watch, computed, onMounted, nextTick } = Vue;
import PagesList from '../../../www/components/pages/PagesList.js'; //載入分頁組件
import QuickSearch from '../../../www/components/form/QuickSearch.js'; //載入頁內搜尋組件

import { useMessagesStore } from '../../stores/messagesStore.js'; //載入 Pinia Store



export default {
  components: {
    PagesList,
    QuickSearch,
  },
  setup() {

    const messagesStore = useMessagesStore();
    
    const tsPate = ref(1); //目前第幾頁
    const refList = ref([]);
    //const refGroupList = ref([]);
    // const trRowsId = ref(0); //目前選取的列
    // const refRowData = ref([{}]); //目前選取的列資料
    
    const tsUid = ref(''); //使用者id
    const tsMsgTitle = ref(''); //訊息標題
    const msgTotal = ref(0);

    const nsTableSet = ref(null); // 用於存儲動態載入的 tableResizeData 模組中的資料

    //其它傳送至組件資料
    // const refSendData = ref({
    //   "cmpId": 0,
    //   //"sourceSupNo": '1',
    // });

    //設定要快速查詢的內容欄位
    const quickSearchColumn = ['car_name', 'car_license', 'car_user'];
    const quickSearchText = ['車名', '車牌', '姓名'];

    //取得目前日期
    const date = new Date().toISOString().slice(0, 10);

    const setPages = reactive({
      pageSize: 50,        //每頁幾筆
      pageShowCount: 20,   //每頁顥示頁數
      dataCount: 0,        //總資料筆數
    });


    /*** 設定分頁元件 ***/
    const refPages = ref(null);

    const doPagesInit = () => {
      refPages.value.doPageslist_Get();
    }

    /*** 過濾內容 ***/
    const defList = ref([]);

    const doListFilter_Init = () => {
      defList.value = JSON.parse(JSON.stringify(refList.value));
    }

    const doListFilter_Emit = (lists) => {
      if(lists == undefined || lists.value == ""){
          refList.value = defList.value;
      }else{
          refList.value = lists;
      }
    }


    const doListData_Get = (thisPage, title, readType) => {

      if (thisPage == undefined || thisPage == '') {
          thisPage = 1;
      }

    
      if (selectedReadType.value != undefined && selectedReadType.value != '') {
        readType = selectedReadType.value; //讀取類型
      }

      if (readType == undefined || readType == '') {
        readType = 'all';
      }

      tsPate.value = thisPage; //目前第幾頁
      tsMsgTitle.value = title; //訊息標題

      //let formData = $('#searchForm').serializeObject();
      let uid = messagesStore.tsUid.value; //使用者id
      //refSendData.value.cmpId = tsCmpId.value;
      let formData = {
        uid: uid,
        title: title,
        readType: readType, 
      }

      // 合併物件
      //formData = Object.assign(formData, {cmpid: tsCmpId.value});
      console.log('formData:', formData);
      let params = {
        page: thisPage,
        pageSize: setPages.pageSize,
        formData
      };


    // 查詢所有 GROUP Messages
    window.electron.ipcRenderer.invoke('MessageLogByGrp_Get', params)
        .then(response => {
            const { totalCount, data } = response;
            console.log('data-MessageLogByGrp_Get:', data);

            console.log(`Total: ${totalCount}`); // 記錄總筆數
            setPages.dataCount = totalCount;
            refList.value = data; // 更新 users 變數

            msgTotal.value = totalCount;

            //doListFilter_Init();
            // console.log('nsTableSet:', nsTableSet);    

            // 移除所選的列資料
            nsTableSet.value.doTsRow_remove();
        })
        .catch(error => {
          console.error('Error MessageLogByGrp_Get:', error);
        });
    };


     // 在組件掛載時獲取訊息
     const doNotifiMsg_Show = async (title, body, event) => {
      await messagesStore.doNotifiMsg_Show(title, body, event);
      doListData_Get(1, title);

    };

    const selectedReadType = ref('all'); // 預設選中 "全部"

    const handleReadTypeChange = () => {

      // console.log('選擇的讀取類型變更為:', selectedReadType.value);
      let title = tsMsgTitle.value;
      // 根據選擇的類型執行相應的邏輯
      if (selectedReadType.value === 'all') {
        //console.log('顯示全部訊息');
        doListData_Get(1, title, 'all'); // 顯示全部訊息
      } else if (selectedReadType.value === 'unread') {
        //console.log('顯示未讀訊息');
        doListData_Get(1, title, 'unread'); // 顯示未讀訊息
      } else if (selectedReadType.value === 'isread') {
        //console.log('顯示已讀訊息');
        doListData_Get(1, title, 'isread'); // 顯示已讀訊息
      }
    };


    const doCheckboxSelected = () => {
      let bOK = refList.value.some(item => item.selected); // 檢查是否有任一項目被選中
      // console.log('bOK:', bOK);

      if(bOK){
        $("#chcekboxBtnDelete").show();
      }else{
        $("#chcekboxBtnDelete").hide();
      }

    };


    const getSelectedRowIds = () => {
      // 過濾出 selected 為 true 的項目，並提取 rowid
      const selectedRowIds = refList.value
        .filter(item => item.selected) // 過濾出被勾選的項目
        .map(item => item.rowid); // 提取 rowid

      let params = {
        rowids: selectedRowIds,
      };
      console.log('勾選的 params 字串:', params);

      // 查詢所有 GROUP Messages
      window.electron.ipcRenderer.invoke('MessageLog_Del', params)
      .then(response => {
          const { success, affectedRows } = response;
          //console.log('data-MessageLog_Del:', data);

          console.log(`affectedRows: ${affectedRows}`); // 記錄總筆數
          //refList.value = data; // 更新 users 變數

          doListData_Get(1, tsMsgTitle.value, selectedReadType.value); // 顯示全部訊息

          // 移除所選的列資料
          //nsTableSet.value.doTsRow_remove();
      })
      .catch(error => {
        console.error('Error MessageLog_Del:', error);
      });

    };


    const formatDate = (dateString) => {
      if (!dateString) return ''; // 如果日期為空，返回空字串
      const date = new Date(dateString); // 將日期字串轉換為 Date 物件
      return new Intl.DateTimeFormat('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(date); // 格式化日期
    };

    // 排序後的列表，未讀優先
    const sortedList = computed(() => {
      return [...refList.value].sort((a, b) => {
        // 未讀 (isread = false) 排在前面
        return a.isread - b.isread;
      });
    });


    const msgIsAllSelected = ref(false); // 全選的狀態
    // 監聽 isAllSelected 的變化
    watch(
      msgIsAllSelected,(newValue, oldValue) => {
        // console.log(`msgIsAllSelected 從 ${oldValue} 變為 ${newValue}`);   
        refList.value.forEach(item => {
          item.selected = newValue;
        });
      }
    );


    // 監聽單個 checkbox 的變化，更新全選的狀態
    watch(
      () => refList.value.map(item => item.selected),
      (newValues) => {
        // console.log('checkbox 狀態變化:', newValues);
        msgIsAllSelected.value = newValues.every(selected => selected); // 如果所有項目都被選中，則全選
        doCheckboxSelected();
      },
      { deep: true }
    );
    


    onMounted(async () => {
      // 動態載入共用組件
      const tableCommon = await import('../../../www/components/common/tableCommon.js');
      // 將 inCommon 模組中的資料存儲到 inCommonData 中
      nsTableSet.value = tableCommon.default;

      // 初始化
      //doGroupList_Get();
      messagesStore.doMessagesGroupList_Get();
      doListData_Get(1, '出庫單-重量檢查');
    });

    return {
      refGroupList:computed(() => messagesStore.refGroupList.value),
      refList,
      sortedList,
      setPages,
      quickSearchColumn,
      quickSearchText,
      selectedReadType,
      msgTotal,
      msgIsAllSelected,
      doListData_Get,
      getSelectedRowIds,
      formatDate,
    
      doNotifiMsg_Show,
      handleReadTypeChange,
      messagesStore,
      
      nsTableSet // 返回 tableResizeData 模組中的資料
    };
  },

    template: await fetch('./www/views/messages/list.html').then(response => response.text())
 /*
  template: `
    <div class="co-container">
      <div class="co-container-title">車輛管理-{{tableResizeData ? tableResizeData.abc : 'Loading...'}}</div>
      <!-- 其他模板內容 -->
    </div>
  `
  */
};