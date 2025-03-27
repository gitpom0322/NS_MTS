const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;


// 定義 cck_user 模型
const User = sequelize.define('CckUser', {
  auid: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  uid: {
    type: DataTypes.STRING(8),
    allowNull: true
  },
  pwd: {
    type: DataTypes.STRING(32),
    allowNull: true
  },
  name: {
    type: DataTypes.STRING(8),
    allowNull: true
  },
  sys_type: {
    type: DataTypes.STRING(16),
    allowNull: true
  },
  enable: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  cdate: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'cck_user',
  timestamps: false
});


// 同步資料庫
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  });

module.exports = User;