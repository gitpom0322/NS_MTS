const { reactive } = Vue;
import PagesList from '../../../www/components/pages/PagesList.js'; //載入分頁組件


export default {
  components: {
    PagesList
  },
    data() {
      return {
        refList: [],
        setPages: reactive({
          pageSize: 30,        //每頁幾筆
          pageShowCount: 20,   //每頁顥示頁數
          dataCount: 0,        //總資料筆數
        })
      };
    },
    computed: {
        getRowsIndex() {
          return this.refList.map((item, index) => ({
            ...item,
            index: index + 1
          }));
        }
    },
    methods: {

      doDbList_get() {
        // 查詢所有 Managers
        window.electron.ipcRenderer.invoke('users-get')
        .then(data => {
            console.log('data:', data);
            console.log(`Total: ${data.length}`); // 記錄 rows 的筆數
            setPages.dataCount = data.length;
            this.refList = data; // 更新 managers 變數
        })
        .catch(error => {
            console.error('Error fetching users:', error);
        });
      }
    },
    mounted() {
      // 初始化
      this.doDbList_get();
    },
  
    template: await fetch('./www/views/users/list.html').then(response => response.text())
  };