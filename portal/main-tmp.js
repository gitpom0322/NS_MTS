const { app, BrowserWindow, session, WebContentsView, ipcMain } = require('electron');
const path = require('path');
const { sequelize, User, Manager } = require('../nslibs/db/database');



// 禁用安全警告
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// auto reload pages
require('electron-reload')(__dirname);

const createWindow = () => {

  console.log('__dirname', __dirname);
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      additionalArguments: [`--app-dir=${__dirname}`], // 傳遞 __dirname
      // contextIsolation: false, // 必须为 false
      // nodeIntegration: true,   // 必须为 true
    },
    autoHideMenuBar: true,
  });

  mainWindow.loadFile('index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();


  // 設置 Cookie
  const cookie = { url: 'http://www.example.com', name: 'dummy_name', value: 'dummy' };
  session.defaultSession.cookies.set(cookie)
    .then(() => {
      console.log('Cookie set successfully');
    }, (error) => {
      console.error(error);
    });

  // 讀取 Cookie
  session.defaultSession.cookies.get({ url: 'http://www.example.com' })
    .then((cookies) => {
      console.log(cookies);
    }, (error) => {
      console.error(error);
    });


  // 測試資料庫連接和操作
  // Manager.create({ sno: '001', un: 'admin', name: 'Admin', pwd: '123456', createdAt: new Date(), updatedAt: new Date() })
  // .then(manager => {
  //   console.log('Manager created:', manager.toJSON());
  // });

};

//開啟新的視窗
function createNewWindow() {

  // 獲取主視窗的位置
  const mainWindow = BrowserWindow.getAllWindows()[0];
  const [mainWindowX, mainWindowY] = mainWindow.getPosition();

  console.log('__dirname', __dirname);
  
  const newWindow = new BrowserWindow({
    width: 1024,
    height: 800,
    backgroundColor: '#ace47f',
    
    x: mainWindowX + 50, // 向右移動 30px
    y: mainWindowY , // 保持與主視窗相同的 y 位置
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      additionalArguments: [`--app-dir=${__dirname}`], // 傳遞 __dirname
      // contextIsolation: true,
      // enableRemoteModule: false
    },
    autoHideMenuBar: true,
  });
  newWindow.loadFile('car_chicken.html');
  //newWindow.loadFile('newWindow.html');

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
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});


ipcMain.on('open-new-window', () => {
  createNewWindow();
});

module.exports = { createNewWindow };

require('../nslibs/db/dbModel'); // 引入 IPC 處理器