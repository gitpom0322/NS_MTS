const { ref, reactive, watch, computed, onMounted } = Vue;
export default {
  setup() {

    const showNotification = () => {

      　let title = "通知標題";
      let body = `
        單號：S221028002
        出貨廠別：路竹廠
        客戶：伍春企業社-李金福
        客戶地址：雲林縣口湖鄉水井村33號
        預交日期：
        司機：IL-163 鄭博仁 和暉通運
        電話：0937663731

        [哺乳豬S料740碎粒-pro(中包)] : 10.00〔30包〕
        [小豬料740粒-pro(包)] : 10.00〔50包〕
        ——————————————————

        [此張訂單己出貨：2022/12/27 上午 10:15:19]

      `;

      // 將換行符號 (\n) 替換為 <br />
      body = body.replace(/\n/g, '<br />');

      // window.electron.notification.show(title, body);
       window.electron.customNotification.show(title, body);
    };

    const test = () => {
      alert('test');
    };

    const usreinfo = () => {
      // 獲取使用者名稱並顯示在頁面上
      window.electron.getUserInfo().then((username) => {
        document.getElementById('username').textContent = username;
      }).catch((error) => {
        console.error('無法獲取使用者名稱:', error);
      });
    };


    // 儲存數據到 localStorage
    const localStorage_Save = () => {

      let adtime = libAdYearTime_Get();
      let json = {
        result: true,
        msg: '取得資料成功',
        data: {
          uid: 'N10617',
          name: '陳炳勳',
          department: '資訊部',
          logintime: adtime,
          islogin: 'Y'
        }
      }
      const uData = json.data;
      
      document.getElementById('save-data').addEventListener('click', () => {

        localStorage.setItem('userData', JSON.stringify(uData));
        document.getElementById('output').textContent = '數據已儲存：' + JSON.stringify(uData.name);
      });

    };


    // 從 localStorage 讀取數據
    const localStorage_Read = () => {
          
      document.getElementById('load-data').addEventListener('click', () => {
        const data = localStorage.getItem('userData');
        if (data) {
          document.getElementById('output').textContent = '讀取數據：' + data;
          console.log('讀取數據:', JSON.parse(data));
        } else {
          document.getElementById('output').textContent = '沒有找到數據';
          console.log('沒有找到數據');
        }
      });

    };

    //清除 localStorage 中的數據
    const localStorage_Clear = () => {

      document.getElementById('clear-data').addEventListener('click', () => {
        localStorage.removeItem('myData');
        document.getElementById('output').textContent = '數據已清除';
        console.log('數據已清除');
      });
    }
  

    // 呼叫通知
    // showNotification();

    onMounted(() => {
     
      // setTimeout(() => {
      //   showNotification();
      // }, 5000);

      usreinfo();
      localStorage_Save();

    });

    return {
      showNotification,
      test,
      usreinfo
  
    };
  },
 
  template: `
    <div>
      <h1><a href="javascript:;" @click="test">Home Page2</a></h1>
    </div>
     <div>
      <h1><a href="javascript:;" @click="showNotification">Home Page3</a></h1>
    </div>


    <br /><br />
    <div><button type="button" id="save-data">儲存數據到 localStorage</button></div>
    <div id="output"></div>

  
    <br /><br />
    <div>
      <h1>Windows 登入帳戶名稱</h1>
      <p id="username">載入中...</p>
    </div>



  `,
};