var handleRenderSelect2 = function() {
	// $(".default-select2").select2();
	// $(".multiple-select2").select2({ placeholder: "Select a state" });

    //$("#ProdNo").select2();
    
};

var FormPlugins = function () {
	"use strict";
	return {
		//main function
		init: function () {
			
			//handleRenderClipboard();
			//handleRenderColorpicker();
            //handleRenderDateRangePicker();
			//handleRenderFormMaskedInput();
			//handleRenderIonRangeSlider();
            //handleRenderJqueryTagIt();
            //handleRenderJqueryAutocomplete();
			//handleRenderTimepicker();
			//handleRenderDatepicker();	
			//handleRenderBootstrapTimePicker();					
			handleRenderSelect2();
			//handleRenderSelectPicker(); 

            //alert(1);
			
		}
	};
}();

$(document).ready(function() {
	console.log("form-plugins.init.js");
	
	//FormPlugins.init();
	
	// $(document).on('theme-change', function() {
	// 	handleRenderColorpicker();
	// });

});