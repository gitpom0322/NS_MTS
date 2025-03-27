const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../database').sequelize;


// 定義 cck_cars_manager 模型
const CarsManager = sequelize.define('CarsManager', {
  rowid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true // 設置為自動遞增
  },
  cmpid: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  carid: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  car_name: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  car_license: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  car_user: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  gsm1: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  gsm2: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  oil_type: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  cost_car_type: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  car_style: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  enable: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  cdate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  udate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'cck_cars_manager',
  timestamps: false
});


// 定義 cck_cars_manager 模型
const CarsManagerView = sequelize.define('CarsManagerView', {
  rowid: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true // 設置為自動遞增
  },
  cmpid: {
    type: DataTypes.STRING(16),
    allowNull: false,
  },
  carid: {
    type: DataTypes.STRING(10),
    allowNull: false,
  },
  car_name: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  car_license: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  car_user: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  gsm1: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  gsm2: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  oil_type: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  cost_car_type: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  car_style: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  enable: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  cdate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  udate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  oil_type_name: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  cost_type_name: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  car_style_name: {
    type: DataTypes.STRING(16),
    allowNull: true
  }
  
}, {
  tableName: 'vw_cck_cars_manager',
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
  CarsManager,
  CarsManagerView,
};