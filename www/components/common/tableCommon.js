const { ref, computed} = Vue;

const abc = ref('123567');


/***** 設定欄位拖移大小(B) *****/
const resizingColumn = ref(null);
const startX = ref(100);
const startWidth = ref(0);

const startResize = (event, columnIndex) => {
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
    const thTotal = document.querySelectorAll('#table-adjust th')[resizingColumn.value];
    th.style.width = `${newWidth}px`;
    thTotal.style.width = `${newWidth}px`;
  }
};

const stopResize = () => {
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
  resizingColumn.value = null;
};
/***** 設定欄位拖移大小(E) *****/


const trRowsId = ref(0); //目前選取的列
const refRowData = ref([{}]); //目前選取的列資料

// 取得目前第幾筆
const getRowsIndex = computed(() => {
  let num = (tsPate.value * setPages.pageSize) - setPages.pageSize;
  return num + 1;
});


//取得目前點選欄位列資料
function doListRows_Click(rowid, refList) {
  console.log('rowid', rowid);
  trRowsId.value = rowid;
  //refRowData.value = refList.value.filter(function(item, index, array){
  refRowData.value = refList.filter(function(item, index, array){
      return item.ROWID == rowid;       // 取得大於五歲的
  });

  //套用css
  $('.co-tr-default').removeClass("co-rows-click");
  $('#'+rowid).addClass("co-rows-click");
}

// 移除所選的列資料
function doTsRow_remove() {
  trRowsId.value = '';
  refRowData.value = [{}];
  $('.co-tr-default').removeClass("co-rows-click");
}



const test = () => {
  alert('abc');
};

export default {
  abc,
  resizingColumn,
  startX,
  startWidth,
  startResize,
  handleResize,
  stopResize,
  getRowsIndex,
  trRowsId,
  refRowData,
  doTsRow_remove,
  doListRows_Click,
  
};