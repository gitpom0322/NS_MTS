const { Sequelize, DataTypes } = require('sequelize');


const db_user = 'root';
const db_pwd = 'mysql0322';
const db_name = 'el_work';

// 配置 Sequelize 來使用 MySQL 資料庫
const sequelize = new Sequelize(db_name, db_user, db_pwd, {
  host: 'localhost',
  dialect: 'mysql'
});


// 定義 Manager 模型
const Manager = sequelize.define('Manager', {
  sno: {
    type: DataTypes.STRING(13),
    allowNull: false,
    defaultValue: '',
    comment: '編號',
    primaryKey: true
  },
  un: {
    type: DataTypes.STRING(12),
    allowNull: false,
    defaultValue: '',
    comment: '登入帳號'
  },
  name: {
    type: DataTypes.STRING(24),
    allowNull: false,
    defaultValue: '',
    comment: '姓名'
  },
  pwd: {
    type: DataTypes.STRING(32),
    allowNull: false,
    defaultValue: '',
    comment: 'md5(密碼)'
  },
  gsm: {
    type: DataTypes.STRING(20),
    defaultValue: '',
    comment: '手機號碼'
  },
  email: {
    type: DataTypes.STRING(120),
    defaultValue: ''
  },
  sort: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  enable: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    comment: '啟用/關閉'
  },
  level: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '等級'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'created_at'
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    field: 'updated_at'
  }
}, {
  tableName: 'manager',
  timestamps: true
});

// 同步資料庫
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  });

module.exports = {
  sequelize,
  Manager
};