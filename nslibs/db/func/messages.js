const { ipcMain } = require('electron');
const { Op, Sequelize } = require('sequelize'); // 引入 Sequelize 的操作符

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
      //isshow: 0, // 只查詢啟用的資料,
      isread:0,
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



ipcMain.handle('MessageLogByGrp_Get', async (event, params) => {
  try {
    // const { keyword } = params;
    const fdata =  params.formData;

    // 查詢條件
    const whereOption = {
      uid: fdata.uid,
      title: fdata.title,
      isdel: 0, // 只顯示未刪除的資料,
    };

    if(fdata.readType == 'unread'){
      whereOption.isread = 0; // 未讀
    }else if(fdata.readType == 'isread'){
      whereOption.isread = 1; // 已讀
    } 

    console.log('whereOption:', whereOption);

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

//取得 訊息群組
ipcMain.handle('MessageLogGroup_Get', async (event, params) => {
  try {
    // 查詢條件
    const whereOption = {
      uid: params.uid,
      isread: 0, // 只查詢未讀的資料
    };


    // 查詢總筆數
    //const totalCount = await MessageLog.count({ where: whereOption });

    const textColor = ['text-dark', 'text-blue', 'text-success', 'text-warning', 'text-danger']; // 定義顏色陣列

    // 查詢數據，按 title 分組
    const data = await MessageLog.findAll({
      attributes: [
        'title', // 分組的欄位
        [Sequelize.fn('COUNT', Sequelize.col('title')), 'count'], // 計算每個分組的數量
      ],
      where: whereOption,
      group: ['title'], // 按 title 分組
      order: [['title', 'ASC']], // 按 title 升序排序
    });

    // 將 textColor 依序分配到每個項目
    const dataWithColors = data.map((row, index) => {
      const jsonData = row.toJSON();
      jsonData.textColor = textColor[index % textColor.length]; // 循環分配顏色
      return jsonData;
    });

    return {
      success: true,
      data: dataWithColors, // 將結果轉為 JSON 格式
    };

  } catch (error) {
    console.error('Error MessageLogGroup_Get:', error);
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

ipcMain.handle('MessageLog_Del_Sql', async (event, rowData) => {
  
  const query = MessageLog.sequelize.dialect.queryGenerator.updateQuery(
    'MessageLog', // 表名
    { isdel: '1' }, // 更新的欄位和值
    {
      rowid: {
        [Op.in]: rowData.rowids, // 使用 Op.in 實現 WHERE rowid IN (...)
      },
    },
    {}
  );
  
  console.log('Generated SQL:', query);


});



ipcMain.handle('MessageLog_Del', async (event, rowData) => {
  try {

    // const matchingRows = await MessageLog.findAll({
    //   where: {
    //     rowid: {
    //       [Op.in]: [44, 45],
    //     },
    //   },
    // });
    // console.log('xxx data:', matchingRows.map(row => row.toJSON()));

    console.log('xxx data:', rowData.rowids);
    // 使用 Sequelize 的 update 方法執行更新
    const result = await MessageLog.update(
      { isdel: 1 }, // 將 isdel 設為 1
      {
        where: {
          rowid: {
            [Op.in]: rowData.rowids, // 使用 Op.in 實現 WHERE rowid IN (...)
          },
        },
      }
    );

    console.log('updating OK:', result);
    return { success: true, affectedRows: result[0] }; // 返回受影響的行數
  } catch (error) {
    console.error('Error updating:', error);
    return { success: false, error: error.message };
  }
});