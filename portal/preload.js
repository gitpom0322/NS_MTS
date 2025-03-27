const { contextBridge, ipcRenderer } = require('electron');
//const path = require('path');

// 獲取傳遞的 __dirname
const appDir = process.argv.find(arg => arg.startsWith('--app-dir=')).split('=')[1];


console.log('Preload script loaded-2223');

contextBridge.exposeInMainWorld('electron', {
  closeWindow: () => {
    console.log('closeWindow called');
    ipcRenderer.send('close-notification-window');
  },
  //取得使用者資訊
  getUserInfo: async () => {
    return await ipcRenderer.invoke('get-user-info');
  },
  
  dirname: appDir,
  joinPath: (...args) => path.join(...args),
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    invoke: (channel, data) => ipcRenderer.invoke(channel, data)
  },

  // notification: {
  //   show: (title, body) => {
  //     const notification = new Notification({
  //       title: title,
  //       body: body,
  //       // icon: path.join(appDir, 'assets', 'icon.png') // 可選：自訂圖示
  //     });

  //     notification.show();

  //     // 可選：監聽通知點擊事件
  //     notification.on('click', () => {
  //       console.log('通知被點擊！');
  //     });
  //   }
  // },

  // 訊息通知
  notification: {
    show: (title, body) => {
      ipcRenderer.send('show-notification', { title, body });
    },
  },

  customNotification: {
    show: (title, message) => {
      ipcRenderer.send('show-custom-notification', { title, message });
    },
  },
});




contextBridge.exposeInMainWorld('nsAPI', {
  loadScript: (src, callback) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    script.onload = callback;
    script.onerror = () => console.error(`Failed to load script: ${src}`);
    document.head.appendChild(script);
  }
});

window.addEventListener('DOMContentLoaded', () => {
 
  //window.$jq = require('jquery'); // Expose jQuery to the window object
  window.aaa = '123'

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }

  // contextBridge.exposeInMainWorld('jQuery', {
  //   $: require('jquery'),
  //   jQuery: require('jquery')
  // });
  
})




