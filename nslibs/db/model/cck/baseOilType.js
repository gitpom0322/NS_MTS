const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../database').sequelize;


// 定義 BaseOilType 模型
const BaseOilType = sequelize.define('BaseOilType', {
  rowid: {
    type: DataTypes.STRING(16),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  enable: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  sort: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cdate: {
    type: DataTypes.DATE,
    allowNull: true
  },

}, {
  tableName: 'cck_base_oil_type',
  timestamps: false
});



// 同步資料庫
/*
sequelize.sync() 會同步資料庫結構，這在開發環境中可能有用，但在生產環境中可能會導致意外的資料庫結構變更。
如果您不需要自動同步資料庫結構，建議移除這段程式碼，或者僅在開發環境中執行。
*/
// sequelize.sync()
//   .then(() => {
//     console.log('Database & tables created!');
// });


// 匯出所有模型
module.exports = {
  BaseOilType,
};