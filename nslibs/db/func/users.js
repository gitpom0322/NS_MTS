const { ipcMain } = require('electron');
const { Op } = require('sequelize'); // 引入 Sequelize 的操作符

const Users = require('../../../nslibs/db/model/usersModel');

// 使用 Manager 模型
Users.findAll().then(rows => {
  // console.log(rows);
  
});



// 處理 IPC 請求，接收參數
ipcMain.handle('users-get', async (event, params) => {
  const { page, pageSize, formData } = params;

  const offset = (page - 1) * pageSize;

  //取出查詢關鍵字
  const keyword = formData.keyword || '';

 // 查詢條件
 const whereOption = keyword ? {
  [Op.or]: [
    { email: { [Op.like]: `%${keyword}%` } },
    { name: { [Op.like]: `%${keyword}%` } }
  ]
} : {};

  // 查詢總筆數
  const totalCount = await Users.count({ where: whereOption });

  // 查詢分頁數據
  const data = await Users.findAll({
    where: whereOption,
    limit: pageSize,
    offset: offset
  });

  return {
    totalCount,
    data:data.map(row => row.toJSON())
  }
});

// 處理 IPC 請求
/*
ipcMain.handle('users-get', async () => {
  const data = await Users.findAll();
  return data.map(rows => rows.toJSON());
});
*/

// ipcMain.handle('users-add', async (event, rowData) => {
//   const data = await Manager.create(rowData);
//   return data.toJSON();
// });