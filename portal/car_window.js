const { BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let newWindow = null; // 用於跟蹤新視窗的狀態

// 創建新視窗的函式
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
    x: mainWindowX + 50, // 向右移動 50px
    y: mainWindowY, // 保持與主視窗相同的 y 位置
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      additionalArguments: [`--app-dir=${__dirname}`], // 傳遞 __dirname
    },
    autoHideMenuBar: true,
  });

  // 加載 HTML 文件
  newWindow.loadFile('car_chicken.html');

  // 當新視窗關閉時重置 newWindow 變量
  newWindow.on('closed', () => {
    newWindow = null;
  });
}

// 註冊 IPC 事件
function setupCarWindowHandlers() {
  ipcMain.on('open-new-window', () => {
    createNewWindow();
  });
}

module.exports = { createNewWindow, setupCarWindowHandlers };