// filepath: /d:/NB/公司/SourceCode/專案/js/electron/t01/e01/portal/main.js
const { app, BrowserWindow, session, ipcMain, Notification, dialog } = require('electron');
const path = require('path');
const os = require('os');

const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

// 引入 訊息通知的模組
const { setupNotificationHandlers } = require('../portal/notification.js');
// 引入 自動更新的模組
const { setupAutoUpdater } = require('../portal/update.js');

// 引入資料庫模組
const { sequelize, User, Manager } = require('../nslibs/db/database');

// 引入 car_window.js
const { setupCarWindowHandlers } = require('../portal/car_window.js');


// 檢查日誌檔案的路徑
// console.log('日誌檔案路徑:', log.transports.file.getFile().path);

// 設置 electron-log 的日誌檔案路徑
log.transports.file.resolvePath = () => path.join(app.getPath('userData'), 'logs/main.log');


// 寫入日誌
log.info('應用程式啟動');

//dev tools
if (process.env.NODE_ENV === 'development') {
  const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer');

  installExtension(VUEJS_DEVTOOLS)
      .then((name) => console.log(`已安裝擴充功能: ${name}`))
      .catch((err) => console.error('安裝擴充功能失敗:', err));
}


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


  // 設置自動更新
  setupAutoUpdater(mainWindow);

  // 設置訊息通知
  setupNotificationHandlers();


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


  // 處理渲染進程請求，返回登入帳戶名稱
  ipcMain.handle('get-user-info', () => {
    const userInfo = os.userInfo();
    return userInfo.username; // 返回使用者名稱
  });


};


app.whenReady().then(() => {

  createWindow();

  // 初始化car_window 相關
  setupCarWindowHandlers();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});



ipcMain.on('restart_app', () => {
  autoUpdater.quitAndInstall();
});


require('../nslibs/db/dbModel'); // 引入 IPC 處理器
require('../nslibs/cookie/cookieSet'); // 引入 cookie 處理

