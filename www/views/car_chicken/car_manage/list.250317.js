const { ref, reactive, watch, computed, onMounted, nextTick } = Vue;
import PagesList from '../../../../www/components/pages/PagesList.js'; //載入分頁組件
import QuickSearch from '../../../../www/components/form/QuickSearch.js'; //載入頁內搜尋組件
import AddForm from '../../../../www/views/car_chicken/car_manage/addForm.js'; //載入表單

export default {
  components: {
    PagesList,
    QuickSearch,
    AddForm,
  },
  setup() {
    const refList = ref([]);
    const tsPate = ref(1); //目前第幾頁
    const trRowsId = ref(0); //目前選取的列
    const refRowData = ref([{}]); //目前選取的列資料
    const tsCmpId = ref(''); //目前公司id
    const nsTableSet = ref(null); // 用於存儲動態載入的 tableResizeData 模組中的資料

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



    // 移除所選的列資料
    function doTsRow_remove() {
      trRowsId.value = '';
      refRowData.value = [{}];
      $('.co-tr-default').removeClass("co-rows-click");
    }

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

    //取得公司id
    const doCookieByCmpid_Get = () => {
      // 從主進程讀取 Cookie
      window.electron.ipcRenderer.invoke('get-cookie', 'ns-cmpid')
      .then(cookieValue => {
        // console.log('Cookie value:', cookieValue);
        tsCmpId.value = cookieValue;
        return cookieValue;
        // 在這裡你可以使用 cookieValue 進行其他操作
      })
      .catch(error => {
        console.error('Error fetching get-cookie:', error);
      });
    }

    const doListData_Get = (thisPage) => {

      if (thisPage == undefined || thisPage == '') {
          thisPage = 1;
      }
      tsPate.value = thisPage;

      let formData = $('#searchForm').serializeObject();
      // console.log('formData:', formData);

      // 合併物件
      formData = Object.assign(formData, {cmpid: tsCmpId.value});
      console.log('formData2:', formData);
      let params = {
        page: thisPage,
        pageSize: setPages.pageSize,
        formData
      };

      // 查詢所有 Users
      window.electron.ipcRenderer.invoke('CarsManager_Get', params)
        .then(response => {
            const { totalCount, data } = response;
            console.log('data-CarsManager_Get:', data);
            console.log(`Total: ${totalCount}`); // 記錄總筆數
            setPages.dataCount = totalCount;
            refList.value = data; // 更新 users 變數

            doListFilter_Init();

            // 移除所選的列資料
            doTsRow_remove();
        })
        .catch(error => {
          console.error('Error fetching CarsManager_Get:', error);
        });
    };

    // 公司id變更時
    watch([() => tsCmpId.value], () => {
      // nextTick(doListData_Get(1));
      doListData_Get(1);
    });


    onMounted(async () => {
      // 動態載入共用組件
      const tableCommon = await import('../../../../www/components/common/tableCommon.js');
      // 將 inCommon 模組中的資料存儲到 inCommonData 中
      nsTableSet.value = tableCommon.default;

  
      //取得公司id
      doCookieByCmpid_Get();
      //console.log('cmpid:', cmpid);
      
      // 初始化
      //doListData_Get(1);
    });

    return {
      trRowsId,
      refRowData,
      refList,
      setPages,
      getRowsIndex,
      quickSearchColumn,
      quickSearchText,
      doListData_Get,
      doListRows_Click,
      doPagesInit,
      doListFilter_Emit,
      nsTableSet // 返回 tableResizeData 模組中的資料
    };
  },

    template: await fetch('./www/views/car_chicken/car_manage/list.html').then(response => response.text())
 /*
  template: `
    <div class="co-container">
      <div class="co-container-title">車輛管理-{{tableResizeData ? tableResizeData.abc : 'Loading...'}}</div>
      <!-- 其他模板內容 -->
    </div>
  `
  */
};