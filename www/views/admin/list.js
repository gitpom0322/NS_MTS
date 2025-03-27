export default {
    data() {
      return {
        refList: []
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
      doDbManagers_add(){
        window.electron.ipcRenderer.invoke('create-manager', { sno: '003', un: 'user3', name: 'User3', pwd: 'abcdef', createdAt: new Date(), updatedAt: new Date() })
        .then(manager => {
            console.log('Manager created:', manager);
        })
        .catch(error => {
            console.error('Error creating manager:', error);
        });
      },
      doDbManagers_get() {
        // 查詢所有 Managers
        window.electron.ipcRenderer.invoke('get-managers')
        .then(managers => {
            console.log('Managers:', managers);
            this.refList = managers; // 更新 managers 變數
        })
        .catch(error => {
            console.error('Error fetching managers:', error);
        });
      }
    },
    mounted() {
      // 初始化
      this.doDbManagers_get();
    },
  
    template: await fetch('./www/views/admin/list.html').then(response => response.text())
  };