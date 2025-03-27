const { ipcMain } = require('electron');
const { Op } = require('sequelize'); // 引入 Sequelize 的操作符

const { MessageLog }  = require('../../../nslibs/db/model/messagesModel');

// BaseOilType.findAll()
// .then(rows => {
//   console.log('BaseOilType 資料:', rows);
// })
// .catch(error => {
//   console.error('BaseOilType 模型測試失敗:', error);
// });


// 查詢 MessageLog 資料
ipcMain.handle('MessageLog_Get', async (event, params) => {
  try {
    // const { keyword } = params;

    // 查詢條件
    const whereOption = {
      uid: params.uid,
      isshow: 0 // 只查詢啟用的資料
    };

    // 查詢總筆數
    const totalCount = await MessageLog.count({ where: whereOption });

    // 查詢數據
    const data = await MessageLog.findAll({
      where: whereOption,
      order: [['rowid', 'ASC']] // 按 rowid 升序排序
    });

    return {
      success: true,
      totalCount,
      data:data.map(row => row.toJSON())
    };

  } catch (error) {
    console.error('Error MessageLog data:', error);
    return { success: false, error: error.message };
  }
});



// 查詢 MessageLog 資料
ipcMain.handle('MessageLog_Count', async (event, params) => {
  try {
    // const { keyword } = params;

    // 查詢條件
    const whereOption = {
      uid: params.uid,
      isshow: 0 // 只查詢啟用的資料
    };

    // 查詢總筆數
    const totalCount = await MessageLog.count({ where: whereOption });

    return {
      success: true,
      totalCount,
    };

  } catch (error) {
    console.error('Error MessageLog data:', error);
    return { success: false, error: error.message };
  }
});


// 只取一筆
ipcMain.handle('MessageLogById_Get', async (event, params) => {
  const { rowid } = params;

  // 查詢條件
  const whereOption = {
    rowid: rowid
  };

  // 查詢一筆數據
  const data = await MessageLog.findOne({
    where: whereOption
  });

  return {
    rowData: data ? data.toJSON() : null
  };
});



// 更新資料
ipcMain.handle('MessageLog_Upd', async (event, rowData) => {
  try {

    if (!rowData.rowid) {
      throw new Error('Missing required field: rowid');
    }

    let db_rowid = Number(rowData.rowid);

    // 查詢現有資料
    const existingRow = await MessageLog.findOne({ where: { rowid: db_rowid } });
    if (!existingRow) {
      throw new Error(`Row with rowid ${db_rowid} does not exist.`);
    }

    // 檢查是否有變更
    const isSameData = Object.keys(rowData).every(
      key => rowData[key] === existingRow[key]
    );
    if (isSameData) {
      return { success: true, message: 'No changes detected in the data.' };
    }

    // 執行更新操作
    const [affectedRows] = await MessageLog.update(rowData, {
      where: { rowid: db_rowid}
    });

    // if (affectedRows === 0) {
    //   throw new Error('No rows were updated. Please check the rowid.');
    // }

    return { success: true, affectedRows };
  } catch (error) {
    console.error('Error updating data:', error);
    return { success: false, error: error.message };
  }
});