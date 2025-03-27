const { contextBridge } = require('electron');

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




