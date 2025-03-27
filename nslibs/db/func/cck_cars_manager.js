const { ipcMain } = require('electron');
const { Op } = require('sequelize'); // 引入 Sequelize 的操作符

const { BaseCarStyle }  = require('../../../nslibs/db/model/cck/baseCarStyle');
const { BaseCostType}  = require('../../../nslibs/db/model/cck/baseCostType');
const { BaseOilType }  = require('../../../nslibs/db/model/cck/baseOilType');

const { CarsManager, CarsManagerView }  = require('../../../nslibs/db/model/cck/carsManager');

// // 使用 Manager 模型


// BaseOilType.findAll()
// .then(rows => {
//   console.log('BaseOilType 資料:', rows);
// })
// .catch(error => {
//   console.error('BaseOilType 模型測試失敗:', error);
// });



// 處理 IPC 請求，接收參數
ipcMain.handle('CarsManager_Get', async (event, params) => {
  const { page, pageSize, formData } = params;

  const offset = (page - 1) * pageSize;

  //取出查詢關鍵字
  const keyword = formData.keyword || '';
  const cmpid = formData.cmpid || '';

// 查詢條件
const whereOption = {
  cmpid: cmpid, // 加入 cmpid 條件
  ...(keyword && {
    [Op.or]: [
      { car_name: { [Op.like]: `%${keyword}%` } },
      { car_license: { [Op.like]: `%${keyword}%` } },
      { car_user: { [Op.like]: `%${keyword}%` } }
    ]
  })
};

  // 查詢總筆數
  const totalCount = await CarsManagerView.count({ where: whereOption });

  // 查詢分頁數據
  const data = await CarsManagerView.findAll({
    where: whereOption,
    limit: pageSize,
    offset: offset,
    order: [['carid', 'DESC']] // 按照 createdAt 欄位降序排序
  });

  return {
    totalCount,
    data:data.map(row => row.toJSON())
  }
});

// 只取一筆
ipcMain.handle('CarsManagerById_Get', async (event, params) => {
  const { rowid } = params;

  // 查詢條件
  const whereOption = {
    rowid: rowid
  };

  // 查詢一筆數據
  const data = await CarsManagerView.findOne({
    where: whereOption
  });

  return {
    rowData: data ? data.toJSON() : null
  };
});


// 新增資料
ipcMain.handle('CarsManager_Add', async (event, rowData) => {
  try {
    // 手動檢查必要欄位
    if (!rowData.car_name || !rowData.cmpid) {
      throw new Error('Missing required fields: car_name or cmpid');
    }

    const data = await CarsManager.create(rowData);
    return { success: true, data: data.toJSON() };
  } catch (error) {
    console.error('Error adding data:', error);
    return { success: false, error: error.message };
  }
});


// 更新資料
ipcMain.handle('CarsManager_Upd', async (event, rowData) => {
  try {

    if (!rowData.rowid) {
      throw new Error('Missing required field: rowid');
    }

    let db_rowid = Number(rowData.rowid);

    // 查詢現有資料
    const existingRow = await CarsManager.findOne({ where: { rowid: db_rowid } });
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
    const [affectedRows] = await CarsManager.update(rowData, {
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




// 查詢 BaseOilType 資料
ipcMain.handle('BaseOilType_Get', async (event, params) => {
  try {
    // const { keyword } = params;

    // 查詢條件
    const whereOption = {
      enable: 1 // 只查詢啟用的資料
    };

    // 查詢總筆數
    const totalCount = await BaseOilType.count({ where: whereOption });

    // 查詢數據
    const data = await BaseOilType.findAll({
      where: whereOption,
      order: [['sort', 'ASC']] // 按 sort 升序排序
    });

    return {
      success: true,
      totalCount,
      data:data.map(row => row.toJSON())
    };

  } catch (error) {
    console.error('Error fetching BaseOilType data:', error);
    return { success: false, error: error.message };
  }
});


// 查詢 BaseCarStyle 資料
ipcMain.handle('BaseCarStyle_Get', async (event, params) => {
  try {
    // const { keyword } = params;

    // 查詢條件
    const whereOption = {
      enable: 1 // 只查詢啟用的資料
    };

    // 查詢總筆數
    const totalCount = await BaseCarStyle.count({ where: whereOption });

    // 查詢數據
    const data = await BaseCarStyle.findAll({
      where: whereOption,
      order: [['sort', 'ASC']] // 按 sort 升序排序
    });

    return {
      success: true,
      totalCount,
      data:data.map(row => row.toJSON())
    };

  } catch (error) {
    console.error('Error fetching BaseCarStyle data:', error);
    return { success: false, error: error.message };
  }
});



// 查詢 BaseCostType 資料
ipcMain.handle('BaseCostType_Get', async (event, params) => {
  try {
    // const { keyword } = params;

    // 查詢條件
    const whereOption = {
      enable: 1 // 只查詢啟用的資料
    };

    // 查詢總筆數
    const totalCount = await BaseCostType.count({ where: whereOption });

    // 查詢數據
    const data = await BaseCostType.findAll({
      where: whereOption,
      order: [['sort', 'ASC']] // 按 sort 升序排序
    });

    return {
      success: true,
      totalCount,
      data:data.map(row => row.toJSON())
    };

  } catch (error) {
    console.error('Error fetching BaseCostType data:', error);
    return { success: false, error: error.message };
  }
});
