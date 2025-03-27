/*
 
 if (typeof NsWebAPP === "undefined") {
    //因為Javascript無Block Scope,所以PROJECT為全域變數
    var NsWebAPP = {};
}

// 參考:http://notepad.yehyeh.net/Content/WebDesign/Javascript/Namespace.php

NsWebAPP = {
    NS1: {
        property1: 'PROJECT.NS1.P1',
        method1: function () { alert(PROJECT.NS1.property1); },
    },
    property1: 'PROJECT.P1',
    method1: function () { alert(PROJECT.property1); },
};

alert( PROJECT.property1 );
PROJECT.method1();
PROJECT.NS1.method1();

*/

var G_ModalMenu = "";

if (typeof NsWebAPP === "undefined") {
    //因為Javascript無Block Scope,所以PROJECT為全域變數
    var NsWebAPP = {};
}

NsWebAPP = {

    UI: {
        C_PageLoading_Open: true,
        C_PageLoading_Times: 500,

       // G_ModalMenu: null,

        fnScrollTop: function (d) {
            // e.preventDefault();
            var body = $("html, body");
            body.stop().animate({ scrollTop: 0 }, 500, 'swing', function () {
                // alert("Finished animating");
                $('#scroll-top').hide();
            });
        },

        fnPageLoading: function (type) {
            
            var id = '#page-loading-layer, #page-loading';
            if (type == 'show') {
                $(id).show();

            } else {
                $(id).hide();
            }
        },
        
        fnPageReading: function (type) {
            var id = '#page-reading';
            if (type == 'show') {
                $(id).show();

            } else {
                $(id).hide();
            }
        },

        fnModal_Call: function (jqid, callback) {

            console.info(jqid);
            $(jqid).animatedModal({
                afterOpen: function () {
                    // lib_Modal_Pageload();
                    //var oRet = { url: enc_url, param: obj.params };
                    var oRet = {}; //保留帶參數的情況
                    //var oRet = { url: 'abc', param: '香蕉好吃' };
                    if (typeof callback === 'function') callback(oRet);
                },
            });
                       
        },

        fnModal_Pageload: function () {

            /*
                $.get("test.cgi", { name: "John", time: "2pm" },
                function (data) {
                    alert("Data Loaded: " + data);
                }
                );
            */

            // 待加入錯誤頁面判斷
            if (gourl == undefined || gourl == "") {
                gourl = '/login.aspx';
            }
            // $('#ui-page-new .related').load(gourl);
        },
    },
    UrlEnc: {
        // 可參考 https://www.zhangxinxu.com/wordpress/2018/08/js-base64-atob-btoa-encode-decode/
        fnBasicAuth_Make: function (user, pass) {
            var tok = user + ':' + pass;
            // var hash = Base64.encode(tok);
            var hash = window.btoa(tok);
            return "Basic " + hash;
        },
    },


    WebAPI: {
        fnAppWebAPI_Call: function (obj) {

            //var un = 'N10116';
            //var pwd = '2344';

            if (obj.api_source == 'outside') {

                if (obj.un == undefined || obj.un == '') {
                    alert('un掉值,請重新登入系統!');
                    // location.href = '/login.aspx';
                    return false;
                }

                if (obj.pwd == undefined || obj.pwd == '') {
                    alert('pwd掉值!');
                    return false;
                }
            }

            if (obj.gourl == undefined || obj.gourl == '') {
                alert('gourl掉值!');
                return false;
            }

            if (obj.callback == undefined || obj.callback == '') {
                alert('callback掉值!');
                return false;
            }

            if (obj.other_obj == undefined || obj.other_obj == '') {
                obj.other_obj = '';
            }


            if (obj.ajax_method == undefined || obj.ajax_method == '') {
                obj.ajax_method = 'GET';
            }

            if (obj.api_source == undefined || obj.api_source == '') {
                obj.api_source = 'outside';
            }

            if (obj.dataType == undefined || obj.dataType == '') {
                obj.dataType = 'json';
            }


            if (obj.loading_open != undefined && obj.loading_open != '') {
                var loading_open = (obj.loading_open == '0') ? false : true;
                nsJS.UI.C_PageLoading_Open = loading_open;
            } 


            var un = obj.un;
            var pwd = obj.pwd;
            var gourl = obj.gourl;
            var params = obj.params;
            var callback = obj.callback;
            var api_source = obj.api_source;

            if (obj.api_source == 'self') {

                $.ajax({
                    url: gourl,
                    // method : 'POST',
                    method: obj.ajax_method,
                    data: params,
                    // dataType: 'json',
                    dataType: obj.dataType,                  
                    beforeSend: function (req) {
                        if (nsJS.UI.C_PageLoading_Open) {
                            nsJS.UI.fnPageLoading('show');
                        }
                    },
                    success: function (d) {
                        // doServerData_Parse(d);
                        libLoginLostCheck(d);
                        if (typeof callback === 'function') callback(d, obj.other_obj);
                    },
                    error: function (httpRes, textStatus) {
                        // XMLHttpRequest.responseText    XMLHttpRequest.status   XMLHttpRequest.readyState
                        console.info(httpRes);
                        console.info(textStatus);
                        alert("網路不穩!請再重試一次!");
                        nsJS.UI.fnPageLoading('hide');
                    }


                });
            
            }else if (obj.api_source == 'outside') {
                // var auth = lib_BasicAuth_Make(un, pwd);
                var auth = nsJS.UrlEnc.fnBasicAuth_Make(un, pwd);

                $.ajax({
                    url: gourl,
                    // method : 'POST',
                    method: obj.ajax_method,
                    data: params,
                    // dataType: 'json',
                    dataType: obj.dataType,
                    crossDomain: true,
                    beforeSend: function (req) {
                        req.setRequestHeader('Authorization', auth);
                        if (nsJS.UI.C_PageLoading_Open) {
                            nsJS.UI.fnPageLoading('show');
                        }
                    },
                    success: function (d) {
                        libLoginLostCheck(d);
                        // doServerData_Parse(d);
                        if (typeof callback === 'function') callback(d, obj.other_obj);
                    },
                    error: function (httpRes, textStatus) {
                        // XMLHttpRequest.responseText    XMLHttpRequest.status   XMLHttpRequest.readyState
                        console.info(httpRes); 
                        console.info(textStatus);
                        alert("網路不穩!請再重試一次!");
                        nsJS.UI.fnPageLoading('hide');

                    }
                });

            }

        },
    },
    Common: {
        fnSleep: function (s) {    //s表示的毫秒数
            var start = new Date().getTime();
            while (true) if (new Date().getTime() - start > s) break;
        },

       
    },
    //property1: 'PROJECT.P1',
    //method1: function () { alert(PROJECT.property1); },

}
var nsJS = NsWebAPP;

//nsJS.WebAPI.fnAppWebAPI_Call();

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;

    // 调用： var time1 = new Date().Format("yyyy-MM-dd"); var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");
}



$(window).scroll(function () {
    var scrollTop = $(this).scrollTop();
    // console.info(scrollTop);
    if (scrollTop > 120) {
        $('#scroll-top').show();
    } else if (scrollTop < 120) {
        $('#scroll-top').hide();
    }
});

function lib_scroll_top(e) {

    nsJS.UI.fnScrollTop(e);
}


var g_left_menu = '';
function lib_LeftMenu_Init() {

    g_left_menu = new Canvi({
        content: ".js-canvi-menu",
        isDebug: !1,
        navbar: ".myCanvasNav",
        openButton: ".js-canvi-menu-open",
        position: "left",
        pushContent: !1,
        speed: "0.2s",
        width: "100vw",
        responsiveWidths: [{
            breakpoint: "600px",
            width: "280px"
        }, {
            breakpoint: "1280px",
            width: "320px"
        }, {
            breakpoint: "1600px",
            width: "380px"
        }]
    });
}


function lib_doDivHide(selector_id) {

    $('body').click(function (evt) {
        if ($(evt.target).parents("#" + selector_id).length == 0 && evt.target.id != selector_id) {
            $('#' + selector_id).hide();
        }
    });
}


function lib_doElCssRemove(selector_id, css) {

    $('body').click(function (evt) {
        if ($(evt.target).parents("#" + selector_id).length == 0 && evt.target.id != selector_id) {
            $('#' + selector_id).removeClass(css);
        }
    });
}


var g_isclick_allow = true;
function libOnClick_NotRepeat(times) {


    if (times == undefined || times == '') {
        var times = 2 * 1000; 
    }

    //時間內不能重複點擊
    if (g_isclick_allow) {
        g_isclick_allow = false;
        // console.log('g_isclick_allow_:' + g_isclick_allow);
        //定时器
        setTimeout(function () {
            g_isclick_allow = true;
        }, times);
    }
}


function libWebAudio_Load(type) {

    if (type == undefined || type == "") {
        type = 'call';
    }

    // type = 'money';
    var id = "";
    switch (type) {
        case "money":
            id = "bg-mp3-money";
            var audio = $("#" + id)[0];
            // audio.play();
            break;
        default: //call
            id = "bg-mp3-call";
            var audio = $("#" + id)[0];
            // audio.play();
    }

    /*
    var jq = $("#bgMusic").find('source');
    $(jq).prop('src', mp3);
    console.info(jq);
    */

   // var audio = document.getElementById("bgMusic");
    //var audio = $("#" + id)[0];
    //audio.play();

    /*
    //暂停
    audio.pause();

    //停止
    audio.pause();
    audio.currentTime = 0;

    //重新播放
    audio.currentTime = 0;
    audio.play();
    */
}

var g_keep_sn_num = 0;
var g_keep_sn_times = 0;

function libKeepSession_Init() {

    var times = '600s';
    $('body').everyTime(times, libKeepSession_Ajax);

}

function libKeepSession_Ajax() {

    g_keep_sn_num += 1;
    g_keep_sn_times += 10;

    var gourl = "/www/api/login/keepSession.aspx";
    // alert(gourl);
    //var params = $("#frmSend").serialize();
    var params = '';

    $.ajax({
        url: gourl,
        // method : 'POST',
        method: 'POST',
        data: params,
        dataType: 'json',
        success: function (d) {
            // doServerData_Parse(d);
            //if (typeof callback === 'function') callback(d, obj.other_obj);
            // alert("第" + g_keep_sn_times + "秒執行一次看三小" + g_keep_sn_num);
            console.info(d);
            if (d.result) {
                location.href = d.gourl;
            }
        }
    });
  
}


function libKeepSession_Return(d) {
    console.info(d);
    alert("x");
}


function libAutoLogin(key) {

    var gourl = app.serviceUrl.autoLogin;

    var url_params = {
        'autolkey': key
    }

    var params = $.param(url_params);

    $.ajax({
        url: gourl,
        // method : 'POST',
        method: 'POST',
        data: params,
        dataType: 'json',
        beforeSend: function (req) {
            if (nsJS.UI.C_PageLoading_Open) {
                nsJS.UI.fnPageLoading('show');
            }
        },
        success: function (d) {
            // doServerData_Parse(d);
            //if (typeof callback === 'function') callback(d, obj.other_obj);
            console.info(d);
            if (d.result) {
                location.href = d.gourl;
            }
        }
    });

}


function libLoginLostCheck(json) {

    //console.info(json);
    if (json.length > 0) {
        //console.info(json[0]);
        var d = json[0];
        if (d.State == "-1") {
            alert(d.Msg);
            location.href = "/";
            return false;
        }
    }
 
}

function libScript_Import(path) {

    var ts = new Date().getTime();
    var sc = document.createElement("script");
    sc.src = path + "?ts=" + ts;
    $("body").append(sc);
}


function libCss_Import(path) {

    var ts = new Date().getTime();
    var head = document.getElementsByTagName('head')[0];
    var css = document.createElement('link');
    css.type = 'text/css';
    css.rel = 'stylesheet';
    css.href = path + '?ts=' + ts;
    head.appendChild(css);
}


function libSalesChange() {

    var gourl = app.serviceUrl.salesUidChange;

    var change_sales = $('#change_sales').val();
    var sales_name = $('#change_sales :selected').text();
    // alert(change_sales + '-' + sales_name);

    if (change_sales == undefined || change_sales == '') {
        alert('change_sales 掉值!');
        return false;
    }


    var url_params = {
        'change_sales': change_sales,
        'sales_name': sales_name
    }

    var params = $.param(url_params);

    $.ajax({
        url: gourl,
        // method : 'POST',
        method: 'POST',
        data: params,
        dataType: 'json',
        success: function (d) {
            // doServerData_Parse(d);
            // if (typeof callback === 'function') callback(d, obj.other_obj);
            // console.info(d);

            var swal_type = (d.result) ? 'success' : 'error';
            var swal_text = d.text;
            swal({
                title: d.msg,
                text: swal_text,
                type: swal_type
            }).then(function () {
                // libThisModal_Close(this, 'xd_modal_BridOrderCopy');
                location.reload();
            });

        }
    });

}


/********** electron 專案相關(B)  **********/

    //設定公司id
    function libCookieByCmpid_Set() {
        // 從主進程設定 Cookie
        const cmpid = '951121';
        const set_cookie = { url: 'http://localhost', name: 'ns-cmpid', value: cmpid, expirationDate: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 };
        window.electron.ipcRenderer.invoke('set-cookie', set_cookie)
        .then(response => {
            if (response.success) {
                console.log('Cookie set successfully');
            } else {
                console.error('Error setting cookie:', response.error);
            }
        })
        .catch(error => {
        console.error('Error setting cookie:', error);
        });
    }

    
    //取得公司id
    const libCookieByCmpid_Get = (ckval) => {
        // 從主進程讀取 Cookie
        window.electron.ipcRenderer.invoke('get-cookie', 'ns-cmpid')
        .then(cookieValue => {
          console.log('Cookie value:', cookieValue);
          ckval.value = cookieValue;
          // return cookieValue;
          // 在這裡你可以使用 cookieValue 進行其他操作
        })
        .catch(error => {
          console.error('Error fetching get-cookie:', error);
        });
    }

    //取得使用者資訊
    const libUserData_Get = () => {

        const userData = localStorage.getItem('userData');
        console.log('userData1:', userData);
        //return JSON.stringify(userData);
        return JSON.parse(userData);
      
    }


    //取得日期時間相關
    const libAdYearTime_Get = () => {
        // 從主進程讀取 Cookie
        // 獲取當前的時間戳
        const timestamp = Date.now();

        // 將時間戳轉換為 Date 物件
        const date = new Date(timestamp);

        // 格式化為西元年月日時間
        let formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} `;
        formattedDate += `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
        
        return formattedDate;

    }

/********** electron 專案相關(E)  **********/


$(document).ready(function (e) {

    // lib_doDivHide('ui-search-tools');

});


// close modal menu if esc key is used
$(document).keyup(function (ev) {
    if (ev.keyCode == 27) {
        modal_menu.close();
    }
}); 

var g_pagetop_btn_close = '<a href="#h" onclick="libThisModal_Close(this);"><i class="fa fa-window-close fa-3x float-left" aria-hidden="true" style="line-height:25px;"></i></a>';
var g_pagetop_btn_top = '<a href="#h" onclick="libModalScroll_Top();"><button type="button" class="btn btn-danger btn-lg float-right" style="margin-top:-10px;line-height:26px;">TOP</button></a>';

