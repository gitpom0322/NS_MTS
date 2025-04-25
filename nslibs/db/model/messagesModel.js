const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;


// 定義 cck_user 模型
const MessageLog = sequelize.define('MessageLog', {
  rowid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(32), // 對應 SQL 的 NVARCHAR(32)
    allowNull: true,
  },
  gid: {
    type: DataTypes.STRING(32), // 對應 SQL 的 VARCHAR(32)
    allowNull: true,
  },
  uid: {
    type: DataTypes.STRING(32), // 對應 SQL 的 VARCHAR(32)
    allowNull: true,
  },
  msg: {
    type: DataTypes.STRING(2048), // 對應 SQL 的 NVARCHAR(2048)
    allowNull: true,
  },
  isshow: {
    type: DataTypes.BOOLEAN, // 對應 SQL 的 BIT
    allowNull: true,
  },
  isread: {
    type: DataTypes.BOOLEAN, // 對應 SQL 的 BIT
    allowNull: true,
  },
  isdel: {
    type: DataTypes.BOOLEAN, // 對應 SQL 的 BIT
    allowNull: true,
  },
  cdate: {
    type: DataTypes.DATE, // 對應 SQL 的 DATETIME
    allowNull: true,
  },
}, {
  tableName: 'message_log', // 對應資料表名稱
  timestamps: false, // 如果資料表沒有 `createdAt` 和 `updatedAt` 欄位，設置為 false
});


// 同步資料庫
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  });

  
// 匯出所有模型
module.exports = {
  MessageLog,
};