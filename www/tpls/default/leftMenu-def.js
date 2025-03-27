const { ref, reactive, watch, computed, onMounted } = Vue;


// const createWindow = () => {
// 	alert('createWindow');
// 	//window.electron.ipcRenderer.send('open-new-window');
// }




export const leftTpl ={

	setup() {
  
	  const dataA = ref('abc');;
	  function doabc() {
  
		alert('x');
	  }
  
	  return {
		doabc,
		dataA,

	  };
	},
	template: await fetch('./www/tpls/leftMenu.html').then(response => response.text())
  };