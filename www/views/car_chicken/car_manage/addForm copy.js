const { ref, reactive, onMounted, watch, computed, defineComponent,
toRaw, compile, nextTick } = Vue;

import moment from 'moment';
import cloneDeep from 'lodash/cloneDeep';

export default {
  setup() {
    
    const bsModal = ref();
    //取得目前日期
    const date = new Date().toISOString().slice(0, 10);
    //date = '2022-03-22';
    const refToday = ref(date);

    const tsProdState = ref([]);      //目前所選取單別
    const tsCmd = ref('');          //目前模式

    const fbd = ref({}); //表單資料

    let uiModal = null;

    // 開啟 bootstrap Modal
    //let myModal = new bootstrap.Modal(document.getElementById('addForm')); 
    uiModal = new bootstrap.Modal(bsModal.value);  

    // 监听 hide.bs.modal 事件
    bsModal.value.addEventListener('hide.bs.modal', (event) => {
        // 在这里添加隐藏模态框时的逻辑
        //alert('Modal is about to be hidden');
        // tsFirstInit.value = 0;
        // tsProdNo.value = "";  
    });
   

    onMounted(() => {
      // 初始化
    //   doListData_Get(1);
    });

    return {
      
    };
  },
  template: await fetch('./www/views/car_chicken/car_manage/addForm.html').then(response => response.text())
};