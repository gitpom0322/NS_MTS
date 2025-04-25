// filepath: /d:/NB/公司/SourceCode/專案/js/electron/t01/e01/portal/main.js
const { app, BrowserWindow, session, ipcMain, Notification } = require('electron');
const path = require('path');
const os = require('os');

const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

const { sequelize, User, Manager } = require('../nslibs/db/database');

//dev tools
if (process.env.NODE_ENV === 'development') {
  const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer');

  installExtension(VUEJS_DEVTOOLS)
      .then((name) => console.log(`已安裝擴充功能: ${name}`))
      .catch((err) => console.error('安裝擴充功能失敗:', err));
}


// 設置日誌記錄
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');


// 禁用安全警告
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// auto reload pages
require('electron-reload')(__dirname);



let newWindow = null; // 用於跟蹤新視窗的狀態

//主視窗建立程式
const createWindow = () => {
  console.log('__dirname', __dirname);
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      additionalArguments: [`--app-dir=${__dirname}`], // 傳遞 __dirname
      //nodeIntegration: false, // 啟用 Node.js
      contextIsolation: true, // 禁用 Context Isolation
    
    },
    autoHideMenuBar: true,
  });

 
  //mainWindow.loadFile('index.html');
  mainWindow.loadFile('login.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();


  // 設定自訂更新伺服器 URL
  autoUpdater.setFeedURL({
    provider: 'generic',
    url: 'http://app.non-sheng.com.tw/updates/ns_mts/' // 替換為你的更新伺服器 URL
  });


 // 啟動自動更新檢查
  autoUpdater.checkForUpdatesAndNotify();


  // 設置 Cookie
  //const cookie = { url: 'http://eip.non-sheng.com', name: 'ns-pok', value: 'ok' };
  const cookie = { url: 'http://localhost', name: 'ns-pok', value: 'ok' };
  session.defaultSession.cookies.set(cookie)
    .then(() => {
      console.log('Cookie set successfully');
    }, (error) => {
      console.error(error);
    });

  // 讀取 Cookie
  session.defaultSession.cookies.get({ url: 'http://localhost' })
    .then((cookies) => {
      console.log(cookies);
    }, (error) => {
      console.error(error);
    });


  // IPC 監聽通知請求
  ipcMain.on('show-notification', (event, args) => {
    const { title, body } = args;
    const notification = new Notification({
      title: title,
      body: body,
      icon: path.join(__dirname, 'assets', 'icon.png'), // 可選：自訂圖示
    });

    notification.show();

    notification.on('click', () => {
      console.log('通知被點擊！');
      
    });
  });


  // 處理渲染進程請求，返回登入帳戶名稱
  ipcMain.handle('get-user-info', () => {
    const userInfo = os.userInfo();
    return userInfo.username; // 返回使用者名稱
  });




};

// 開啟新的視窗
function createNewWindow() {
  if (newWindow) {
    // 如果新視窗已經存在，則不再創建新的視窗
    newWindow.focus();
    return;
  }

  // 獲取主視窗的位置
  const mainWindow = BrowserWindow.getAllWindows()[0];
  const [mainWindowX, mainWindowY] = mainWindow.getPosition();

  console.log('__dirname', __dirname);

  newWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    backgroundColor: '#ace47f',
    x: mainWindowX + 50, // 向右移動 30px
    y: mainWindowY, // 保持與主視窗相同的 y 位置
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      additionalArguments: [`--app-dir=${__dirname}`], // 傳遞 __dirname
      // enableRemoteModule: false
    },
    autoHideMenuBar: true,
  });

  newWindow.loadFile('car_chicken.html');
  // newWindow.loadFile('newWindow.html');


  // 當新視窗關閉時重置 newWindow 變量
  newWindow.on('closed', () => {
    newWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  //訊息通知測試
  // const notification = new Notification({
  //   title: '測試通知',
  //   body: '這是一個測試通知訊息！',
  // });

  // notification.show();

  // notification.on('click', () => {
  //   console.log('通知被點擊！');
  // });


});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


// IPC 監聽通知請求
ipcMain.on('open-new-window', () => {
  createNewWindow();
});

module.exports = { createNewWindow };


// 自動更新事件處理
autoUpdater.on('update-available', (info) => {
  log.info('有可用的更新.');
  // mainWindow.webContents.send('update_available', info);
  dialog.showMessageBox({
    type: 'info',
    title: '更新可用',
    message: '有新的版本可用，正在下載更新...',
  });
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('更新下載完成.');
  // mainWindow.webContents.send('update_downloaded', info);
  dialog
  .showMessageBox({
    type: 'info',
    title: '更新已準備好',
    message: '更新已下載完成，是否立即安裝並重啟應用？',
    buttons: ['是', '否'],
  })
  .then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall(); // 安裝更新並重啟應用
    }
  });
});

autoUpdater.on('error', (error) => {
  console.error('自動更新錯誤:', error);
  dialog.showErrorBox('更新錯誤', error == null ? '未知錯誤' : error.toString());
});

ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});


//browser notification
let notificationWindows = []; // 用於管理多個通知視窗

function showCustomNotification(title, message) {
  // 獲取螢幕的工作區大小
  const { width, height } = require('electron').screen.getPrimaryDisplay().workAreaSize;

  // 計算新通知的顯示位置
  const notificationHeight = 240; // 每個通知視窗的高度
  const notificationMargin = 10; // 通知之間的間距
  const yOffset = height - (notificationHeight + notificationMargin) * (notificationWindows.length + 1);

  // 創建通知視窗
  const notificationWindow = new BrowserWindow({
    width: 400, // 通知視窗寬度
    height: notificationHeight, // 通知視窗高度
    x: width - 420, // 顯示在螢幕右下角
    y: yOffset, // 根據已有通知數量調整位置
    frame: false, // 無邊框
    alwaysOnTop: true, // 始終置頂
    transparent: true, // 背景透明
    resizable: false, // 禁止調整大小
    webPreferences: {
      contextIsolation: true, // 禁用 Context Isolation
      nodeIntegration: false, // 啟用 Node.js  
    },
  });

  // 加載通知內容
  notificationWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
  <html>
    <body style="margin: 0; padding: 10px; font-family: Arial; background: rgba(255, 255, 255, 0.9);
     border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);">
     
      <!-- 標題區域 -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;
       background: #f0f0f0; padding: 5px; border-bottom: 1px solid #ccc;">
        <h3 style="margin: 0; color: #333;" id="abc">${title}</h3>
        <div style="color: #666; font-size: 14px;">
          <button id="close-btn">關閉</button>

        </div>
      </div>

      <!-- 消息內容 -->
      <p style="margin: 5px 0; color: #555;">${message}</p

    </body>


    <script>
    document.addEventListener('DOMContentLoaded', () => {
      const closeButton = document.getElementById('close-btn');
      if (closeButton) {
        closeButton.addEventListener('click', () => {
          console.log('關閉按鈕被點擊');
          window.close();
        });
      } else {
        console.error('找不到 close-btn 按鈕');
      }
      });
    </script>
  </html>
  `));

  // 當通知視窗關閉時，從陣列中移除並調整其他通知的位置
  notificationWindow.on('closed', () => {
    notificationWindows = notificationWindows.filter(win => win !== notificationWindow);
    adjustNotificationPositions();
  });

  // 限制通知視窗數量
  const maxNotifications = 5;
  if (notificationWindows.length >= maxNotifications) {
    const oldestNotification = notificationWindows.shift();
    if (!oldestNotification.isDestroyed()) {
      oldestNotification.close();
    }
  }

  // 自動關閉通知視窗（例如 5 秒後）
  const window_settimes = 1000 * 10;
  // setTimeout(() => {
  //   if (!notificationWindow.isDestroyed()) {
  //     notificationWindow.close();
  //   }
  // }, window_settimes);

  // 將通知視窗加入陣列
  notificationWindows.push(notificationWindow);
}

// 調整所有通知視窗的位置
function adjustNotificationPositions() {
  const { height } = require('electron').screen.getPrimaryDisplay().workAreaSize;
  const notificationHeight = 240; // 每個通知視窗的高度
  const notificationMargin = 10; // 通知之間的間距

  notificationWindows.forEach((win, index) => {
    const yOffset = height - (notificationHeight + notificationMargin) * (index + 1);
    win.setBounds({
      x: win.getBounds().x,
      y: yOffset,
      width: win.getBounds().width,
      height: win.getBounds().height,
    });
  });
}

ipcMain.on('show-custom-notification', (event, args) => {
  const { title, message } = args;
  showCustomNotification(title, message);
});


ipcMain.on('close-notification-window', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win) {
    win.close();
  }
});


require('../nslibs/db/dbModel'); // 引入 IPC 處理器
require('../nslibs/cookie/cookieSet'); // 引入 cookie 處理



