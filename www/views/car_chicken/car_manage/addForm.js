const { ref, reactive, onMounted, watch, computed, defineComponent,
    toRaw, compile, nextTick } = Vue;
    
// import moment from 'moment';
// import cloneDeep from 'lodash/cloneDeep';


export default defineComponent({
  //props: ['rowData', 'sendData'], // 定義 props
  props: ['sendData'], // 定義 props
  emit: ['emit-ListDataGet'], // 定義可以發出的事件

  setup(props, { emit }) {
    const bsModal = ref(null);
    //取得目前日期
    const date = new Date().toISOString().slice(0, 10);
    const refToday = ref(date);

    const tsCmpId = ref(''); //目前公司id
    const tsProdState = ref([]); //目前所選取單別
    const tsCmd = ref(''); //目前模式
    const fbd = ref({}); //表單資料

    const refBaseOilType = ref([]);      //油品種類清單
    const refBaseCostType = ref([]);     //計費車種清單
    const refBaseCarStyle = ref([]);     //車輛樣式清單


    let uiModal = null;


    //表單繫結
    //let fbd = reactive({});
    const frm_init = [{
        "rowid": "",
        "cmpid": "",
        "carid": "",
        "car_name": "",
        "car_license": "",
        "car_user": "",
        "gsm1": "",
        "gsm2": "",
        "oil_type": "",
        "cost_car_type": "",
        "car_style": "",
        "SourceSupName": "",
        "cdate": "1900-01-01:00:00",
    }];

    //let fbd = reactive(cloneDeep(frm_init[0]));

    onMounted(() => {
      
        // 初始化 Bootstrap Modal
        uiModal = new bootstrap.Modal(bsModal.value);

        // 监听 hide.bs.modal 事件
        bsModal.value.addEventListener('hide.bs.modal', (event) => {
        // 在这里添加隐藏模态框时的逻辑
        // console.log('Modal is about to be hidden');
        $('#btnSave').prop('disabled', false); 
        // tsFirstInit.value = 0;
        // tsProdNo.value = "";
        });

    });

    

    function doForm_Bind(cmd, data) {
    
        //  const sendData = props.sendData;
        //方法一:使用JSON.parse
        // fbd = JSON.parse(JSON.stringify(props.formData))[0];
    
        //方法二:使用 toRaw
        //fbd.value = toRaw(props.formData)[0];
    
        const sendData = props.sendData;
        //console.log('sendData', sendData);

        if(cmd == "add"){
            // console.log('frm_init', frm_init[0]);
            frm_init[0].cmpid = sendData.cmpId; 
            fbd.value = reactive(_.cloneDeep(frm_init[0]));
    
        }else if(cmd == "upd"){
            console.log('doForm_Bind-upd', data);
            // fbd.value =  data;      
        };
   
        //data binding
        // if(fbd.value != undefined || fbd.value != null) {

        //     console.log('fbd-upd', fbd.value.ProdNo);
        //     //fCabNo.value = fbd.value.CabNo;
        //     const fobj = {dropdownParent:$("#addForm")};
        //     // sel2_SourceSupNo.select2(fobj).val(fbd.value.SourceSupNo).trigger("change");
        // }

        setTimeout(function() {
            // nsJS.UI.fnPageReading('hide');
        }, 600); 

    }

    //取得油品種類
    function doBaseOilType_Get() {
        
        let params = {};
         // 查詢所有 Users
         window.electron.ipcRenderer.invoke('BaseOilType_Get')
         .then(response => {
             
             // console.log('response', response)
             const { success, totalCount, data } = response;
             refBaseOilType.value = data;
             // doListFilter_Init();
         })
         .catch(error => {
             console.error('Error BaseOilType_Get:', error);
         });
        
    }


    //取得計費車種
    function doBaseCostType_Get() {
        
        let params = {};
         // 查詢所有 Users
         window.electron.ipcRenderer.invoke('BaseCostType_Get')
         .then(response => {      
            //  console.log('response', response)
            const { success, totalCount, data } = response;
            refBaseCostType.value = data;
            
         })
         .catch(error => {
             console.error('Error BaseOilType_Get:', error);
         });
        
    }


    //取得車輛樣式
    function doBaseCarStyle_Get() {
        
        let params = {};
         // 查詢所有 Users
         window.electron.ipcRenderer.invoke('BaseCarStyle_Get')
         .then(response => {      
            console.log('response', response)
            const { success, totalCount, data } = response;
            refBaseCarStyle.value = data;
            
         })
         .catch(error => {
             console.error('Error BaseCarStyle_Get:', error);
         });
        
    }



    //取得單筆表單資料
    function doFormData_Get(cmd, trRowid) {

        console.log('doFormOne_Get');
        //$.cookie('name', 'value', { expires: 7 });

        let params = {
            rowid: trRowid,
        };
    
        // 查詢所有 Users
        window.electron.ipcRenderer.invoke('CarsManagerById_Get', params)
        .then(response => {
            const { rowData } = response;
            
            console.log('rowData', rowData);
            fbd.value = rowData;

        })
        .catch(error => {
            console.error('Error fetching CarsManagerById_Get:', error);
        });
       

    }


    function doModal_Show(cmd, rowid, refRowData) {

        nsJS.UI.fnPageReading('show');
        console.log('rowid',rowid);
        console.log('refRowData', refRowData);

        tsCmd.value = cmd;

        // const tsProdStateId = props.sendData.prodStateId;
        // const tsSourceSupNo = props.sendData.sourceSupNo;
        // console.log('tsSourceSupNo',tsSourceSupNo);

        //取得油品種類
        doBaseOilType_Get();
        //取得計費車種
        doBaseCostType_Get();
        //取得車輛樣式
        doBaseCarStyle_Get();
    
        if(cmd == 'add') {
  
            doForm_Bind(cmd, null);
               
        }else{
    
            if(rowid == undefined || rowid == ''){
                alert("請先選取要修改的資料列");
                // nsJS.UI.fnPageReading('hide');
                return false;
            }
            // let CabNo = refRowData[0].CabNo;    
            doFormData_Get(cmd, rowid);
            
        }
    
        uiModal.show();
    }
    
    function doModal_Hide() {
        uiModal.hide();
    }


    function doForm_Send() {

        $('#btnSave').prop('disabled', true); //防止二次寫入    
        
        let formData = $('#frm-edit').serializeObject();
        // let jsonData = JSON.stringify(formData);
    
        console.log('formData', formData);

        if(tsCmd.value == 'add'){
            onFormData_Add(formData);
        }else if(tsCmd.value == 'upd'){
            onFormData_Upd(formData);
        }
        // return false;

        // 發出事件，通知父組件更新列表
        emit('emit-ListDataGet');
        doModal_Hide();
    
    }


    function onFormData_Add(rowData) {

        // 移除 rowid
        delete rowData.rowid;
        //console.log('rowData', rowData);
        
        window.electron.ipcRenderer.invoke('CarsManager_Add', rowData)
        .then(response => {
            if (response.success) {
                console.log('新增資料成功:', response.data);
                // 可以在這裡更新前端的資料列表
            } else {
                console.error('新增資料失敗:', response.error);
            }
        })
        .catch(error => {
            console.error('Error invoking CarsManager_Add:', error);
        });
    }


    function onFormData_Upd(rowData) {

        console.log('rowData', rowData);

        window.electron.ipcRenderer.invoke('CarsManager_Upd', rowData)
        .then(response => {
          if (response.success) {
            console.log('更新成功，影響的列數:', response.affectedRows);
          } else {
            console.error('更新失敗:', response.error);
          }
        })
        .catch(error => {
          console.error('IPC 調用錯誤:', error);
        });
    }


    function doFormValidate(frm) {

        //select2 第一項不能為空值
        $.validator.methods.notFirstOption = function (val, elm, param) {
            let bOK = false;
            if (val != '') {
                bOK = true;
            }
            return bOK;
        };
    
        //檢查資料需為數值或小數
        $.validator.addMethod("doNumOrDec", function(value, element) {
            return this.optional(element) || /^-?\d+(\.\d+)?$/.test(value);
        });
    
    
        let bOK = $(frm).validate({
            rules: 
            {   
                /*
                carid: {
                    notFirstOption: true
                },
                Piece: {
                    required: true,
                    doNumOrDec: true
                },
                */

                carid: {    //車輛代號
                    required: true,
                },
                car_name: {    //車輛名稱
                    required: true,
                },
                car_license: {    //車牌
                    required: true,
                },
                car_user: {    //司機姓名
                    required: true,
                },
                gsm1: {    //手機號碼1
                    required: true,
                },
                oil_type: {    //油品種類
                    notFirstOption: true,
                },
                cost_car_type: {    //油品種類
                    notFirstOption: true,
                },
                car_style: {    //油品種類
                    notFirstOption: true,
                },
                
            },
            messages: {
                /*
                Piece: {
                    required: "件數必填",
                    doNumOrDec:"件數需為數值或小數",   
                },
                */ 
                carid: {
                    required: "車輛代號-必填",                
                },
                car_name: {
                    required: "車輛名稱-必填",
                },
                car_license: {
                    required: "車牌-必填",
                },
                car_user: {
                    required: "車牌-必填",
                },
                gsm1: {
                    required: "手機號碼1-必填",
                },
                oil_type: {
                    notFirstOption: "請選擇油品種類",
                },
                cost_car_type: {
                    notFirstOption: "請選擇計費車種",
                },
                car_style: {
                    notFirstOption: "請選擇車輛樣式",
                },
            },
            
            
        }).form();
    
        return bOK;
    }
    
    function onSubmit() {

        let frm = $('#frm-edit');
        let ischk = doFormValidate(frm);
        console.log('ischk', ischk);

        if(ischk){
            doForm_Send();
        }

        // doForm_Send();
    }


    return {
      bsModal,
      refToday,
      tsProdState,
      tsCmd,
      fbd,
      refBaseOilType,
      refBaseCostType,
      refBaseCarStyle,
      doModal_Show,
      doModal_Hide,
      onSubmit,
      doForm_Send,
      onFormData_Add,
      onFormData_Upd,

    };
  },
  template: await fetch('./www/views/car_chicken/car_manage/addForm.html').then(response => response.text())
});