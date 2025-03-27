
(function ($) {
    "use strict";


    /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })
  
  
    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    /*
    $('.validate-form').on('submit', function () {
    // $('.login100-form-btn').on('click', function () {
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }
        return check;
    });
    */
    $('.login100-form-btn').on('click', function () {

        alert('Please!');
        location.href = 'index.html';
        return false;

        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                console.info(input[i]);
                showValidate(input[i]);
                check = false;
            }
        }

        if (check) {

            doLogin_Chk();
        }

        return false;

    });

    function doLogin_Chk() {

        // let server = 'http://wim.non-sheng.com.tw';
        var gourl = '/Api/Member/LoginChk.aspx';

        //alert(gourl);
        var un  = $('#un').val();
        var pwd = $('#pwd').val();


        var obj = {
            'ts': new Date().getTime(),
            'accountId': un,
            'pwd': pwd
        }

        var params = $.param(obj);

        $.ajax({
            url: gourl,
            // method : 'POST',
            method: 'POST',
            data: params,
            dataType: 'json',
            success: function (d) {
                console.info(d);

                if (!d.result) {
                    alert("帳號或密碼錯誤!");
                    //location.href = 'login.html';
                    return false;
                }

                let token = d.data;

                if(token==""){
                    alert("token掉值!");
                    return false;
                }


                let ck_expires = { expires: 7 };
                $.cookie('ns_token', token, ck_expires);
                $.cookie('ns_userid', un, ck_expires);

                // alert("登入成功!");

                location.href = 'index.html';

                // doServerData_Parse(d);
                //if (typeof callback === 'function') callback(d);
            }
        });
    }


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();
        console.info(thisAlert);
        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    
    /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).find('i').removeClass('zmdi-eye');
            $(this).find('i').addClass('zmdi-eye-off');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).find('i').addClass('zmdi-eye');
            $(this).find('i').removeClass('zmdi-eye-off');
            showPass = 0;
        }
        
    });


})(jQuery);




