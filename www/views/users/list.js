const { ref, reactive, watch, computed, onMounted, onErrorCaptured, onUpdated } = Vue;
import PagesList from '../../../www/components/pages/PagesList.js'; //載入分頁組件
import QuickSearch from '../../../www/components/form/QuickSearch.js'; //載入頁內搜尋組件

export default {
  components: {
    PagesList,
    QuickSearch,
  },
  setup() {

    const refList = ref([]);
    const tsPate = ref(1); //目前第幾頁
    const trRowsId = ref(0); //目前選取的列
    const refRowData = ref([{}]); //目前選取的列資料

    //設定要快速查詢的內容欄位
    const quickSearchColumn = ['email', 'name', 'gsmno'];
    const quickSearchText = ['Email', '姓名', '手機'];

    //取得目前日期
    const date = new Date().toISOString().slice(0, 10);

    const setPages = reactive({
      pageSize: 30,        //每頁幾筆
      pageShowCount: 20,   //每頁顥示頁數
      dataCount: 0,        //總資料筆數
    });

    const getRowsIndex = computed(() => {
      let num = (tsPate.value * setPages.pageSize) - setPages.pageSize;
      return num + 1;
    });


    function doListRows_Click(rowid) {

        console.log('rowid', rowid);
        trRowsId.value = rowid;
        refRowData.value = refList.value.filter(function(item, index, array){
            return item.ROWID == rowid;       // 取得大於五歲的
        });

        // console.log('refRowData:');
        // console.log(refRowData);

        //套用css
        $('.co-tr-default').removeClass("co-rows-click");
        $('#'+rowid).addClass("co-rows-click");
    }
  

    /*** 設定分頁元件 ***/
    const refPages = ref(null);

    const doPagesInit = () => {
      //alert("doPagesInit");
      refPages.value.doPageslist_Get();
    }



    /*** 過濾內容 ***/
    const defList = ref([]);

    const doListFilter_Init = () => {
      // let def_List = {...refLists};
      defList.value = JSON.parse(JSON.stringify(refList.value));
    }

    const doListFilter_Emit = (lists) => {

      if(lists == undefined || lists.value == ""){
          refList.value = defList.value;
      }else{
          refList.value = lists;
      }
    }
  

    /*** 變更table欄位大小 ***/
    const resizingColumn = ref(null);
    const startX = ref(0);
    const startWidth = ref(0);

    const startResize = (event, columnIndex) => {
        console.log('startResize');
        resizingColumn.value = columnIndex;
        startX.value = event.clientX;
        startWidth.value = event.target.parentElement.offsetWidth;

        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', stopResize);
    };


    const handleResize = (event) => {
        if (resizingColumn.value !== null) {
            const newWidth = startWidth.value + (event.clientX - startX.value);
            const th = document.querySelectorAll('#table-start th')[resizingColumn.value];
            const thTotal = document.querySelectorAll('#table-adjust-total th')[resizingColumn.value];
            th.style.width = `${newWidth}px`;
            thTotal.style.width = `${newWidth}px`;
        }
    };


    const stopResize = () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
        resizingColumn.value = null;
    };
    /*** 變更table欄位大小 ***/




    const doListData_Get = (thisPage) => {

      
      if (thisPage == undefined || thisPage == '') {
          thisPage = 1;
      }
      tsPate.value = thisPage;

      let formData = $('#searchForm').serializeObject();
      console.log('formData:', formData);

      let params = {
        page: thisPage,
        pageSize: setPages.pageSize,
        formData
      };

      // 合併物件
      //const dataParams = Object.assign(formData, params);
      // console.log('params:', params);

      // 查詢所有 Users
      window.electron.ipcRenderer.invoke('users-get', params)
        .then(response => {
            const { totalCount, data } = response;
            console.log('data:', data);
            console.log(`Total: ${totalCount}`); // 記錄總筆數
            setPages.dataCount = totalCount;
            refList.value = data; // 更新 users 變數

            doListFilter_Init();
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    };

    onMounted(() => {
      // 初始化
      doListData_Get(1);
    });

    return {
      refList,
      setPages,
      getRowsIndex,
      doListData_Get,
      doListRows_Click,
      doPagesInit,
      startResize,
      resizingColumn,
      handleResize,
      stopResize,
      quickSearchColumn,
      quickSearchText,
      doListFilter_Emit,

    };
  },
  template: await fetch('./www/views/users/list.html').then(response => response.text())
};