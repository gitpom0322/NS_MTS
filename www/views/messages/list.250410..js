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
    const refGroupList = ref([]);
    // const trRowsId = ref(0); //目前選取的列
    // const refRowData = ref([{}]); //目前選取的列資料
    const tsCmpId = ref(''); //目前公司id
    const tsUid = ref(''); //使用者id

    const nsTableSet = ref(null); // 用於存儲動態載入的 tableResizeData 模組中的資料

    //其它傳送至組件資料
    const refSendData = ref({
      "cmpId": 0,
      //"sourceSupNo": '1',
  });

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


    const doListData_Get = (thisPage, title) => {

      if (thisPage == undefined || thisPage == '') {
          thisPage = 1;
      }
      tsPate.value = thisPage;

      //let formData = $('#searchForm').serializeObject();
      // console.log('formData:', formData);

      //refSendData.value.cmpId = tsCmpId.value;
      let formData = {
        uid:tsUid.value,
        title: title,   
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

            doListFilter_Init();

            // console.log('nsTableSet:', nsTableSet);    

            // 移除所選的列資料
            nsTableSet.value.doTsRow_remove();
        })
        .catch(error => {
          console.error('Error MessageLogByGrp_Get:', error);
        });
    };


    //取得訊息群組
    const doGroupList_Get = () => {

      const userData = libUserData_Get();
      const params = {
        uid: userData.uid,
      };
      
      //console.log('params:', params);
      tsUid.value = userData.uid; //使用者id


      // 查詢所有 Users
      window.electron.ipcRenderer.invoke('MessageLogGroup_Get', params)
        .then(response => {
            const { totalCount, data } = response;

            // console.log('response:', response);
            console.log('data:', data);
            // console.log(`Total: ${totalCount}`); // 記錄總筆數
            //setPages.dataCount = totalCount;
            refGroupList.value = data; // 更新 users 變數
            
            // 移除所選的列資料
            // nsTableSet.value.doTsRow_remove();
        })
        .catch(error => {
          console.error('Error MessageLogGroup_Get:', error);
        });
      };

    

    // 公司id變更時
    // watch([() => tsCmpId.value], () => {
    //   // nextTick(doListData_Get(1));
    //   doListData_Get(1);
    // });


    onMounted(async () => {
      // 動態載入共用組件
      const tableCommon = await import('../../../www/components/common/tableCommon.js');
      // 將 inCommon 模組中的資料存儲到 inCommonData 中
      nsTableSet.value = tableCommon.default;

      
      // 初始化
      doGroupList_Get();
      doListData_Get(1, '出庫單-重量檢查');
    });

    return {
      refList,
      refGroupList,
      setPages,
      quickSearchColumn,
      quickSearchText,
      refSendData,
      doListData_Get,

      doPagesInit,
      doListFilter_Emit,
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