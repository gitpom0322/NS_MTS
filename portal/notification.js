const { BrowserWindow, ipcMain } = require('electron');

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
      nodeIntegration: false, // 禁用 Node.js
    },
  });

  // 加載通知內容
  notificationWindow.loadURL(
    'data:text/html;charset=utf-8,' +
      encodeURIComponent(`
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
      <p style="margin: 5px 0; color: #555;">${message}</p>

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
  `)
  );

  // 當通知視窗關閉時，從陣列中移除並調整其他通知的位置
  notificationWindow.on('closed', () => {
    notificationWindows = notificationWindows.filter((win) => win !== notificationWindow);
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

  // 自動關閉通知視窗（例如 10 秒後）
  const window_settimes = 1000 * 10;
  setTimeout(() => {
    if (!notificationWindow.isDestroyed()) {
      notificationWindow.close();
    }
  }, window_settimes);

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

// 註冊 IPC 事件
function setupNotificationHandlers() {
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
}

module.exports = { setupNotificationHandlers };