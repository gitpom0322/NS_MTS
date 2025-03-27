const { ipcMain } = require('electron');
//const { Manager } = require('../database');

const Manager = require('../../../nslibs/db/model/managerModel');

// 使用 Manager 模型
Manager.findAll().then(managers => {
  console.log(managers);
});


// 處理 IPC 請求
ipcMain.handle('get-managers', async () => {
  const managers = await Manager.findAll();
  return managers.map(manager => manager.toJSON());
});

// ipcMain.handle('create-manager', async (event, managerData) => {
//   const manager = await Manager.create(managerData);
//   return manager.toJSON();
// });