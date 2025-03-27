const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database').sequelize;


// 定義 User 模型
const User = sequelize.define('User', {
  sno: {
    type: DataTypes.STRING(13),
    allowNull: false,
    defaultValue: '',
    comment: '編號',
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING(120),
    allowNull: false,
    defaultValue: '',
    comment: '電子信箱'
  },
  user_id: {
    type: DataTypes.STRING(10),
    defaultValue: null
  },
  email_ok: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    comment: '信箱認証過了?'
  },
  email_vrf: {
    type: DataTypes.STRING(5),
    allowNull: false,
    comment: '信箱驗證碼'
  },
  email_vrf_type: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 0,
    comment: '驗證通過方式: 0:收驗證信 1:自行寄驗證信'
  },
  gsmno: {
    type: DataTypes.STRING(15),
    allowNull: false,
    comment: '手機號碼'
  },
  gsm_ok: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    comment: '手機認証過了?'
  },
  gsm_vrf: {
    type: DataTypes.STRING(5),
    allowNull: false,
    comment: '手機驗證碼'
  },
  pw: {
    type: DataTypes.STRING(15),
    allowNull: false,
    comment: '密碼'
  },
  name: {
    type: DataTypes.STRING(32),
    allowNull: false,
    defaultValue: '',
    comment: '姓名'
  },
  birthday: {
    type: DataTypes.DATE,
    defaultValue: null,
    comment: '生日'
  },
  addr: {
    type: DataTypes.STRING(255),
    defaultValue: null,
    comment: '註冊地址'
  },
  addr_zip: {
    type: DataTypes.STRING(7),
    defaultValue: '',
    comment: '郵遞區號'
  },
  last_ip: {
    type: DataTypes.STRING(32),
    allowNull: false,
    defaultValue: '',
    comment: '上次上線IP'
  },
  last_addr: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: '',
    comment: '地址'
  },
  last_lng: {
    type: DataTypes.DOUBLE(10, 7),
    allowNull: false,
    defaultValue: 0.0000000,
    comment: '經度'
  },
  last_lat: {
    type: DataTypes.DOUBLE(10, 7),
    allowNull: false,
    defaultValue: 0.0000000,
    comment: '緯度'
  },
  last_E97: {
    type: DataTypes.DOUBLE(10, 1),
    allowNull: false,
    defaultValue: 0.0,
    comment: 'TWD97 E 座標'
  },
  last_N97: {
    type: DataTypes.DOUBLE(10, 1),
    allowNull: false,
    defaultValue: 0.0,
    comment: 'TWD97 N 座標'
  },
  bonus: {
    type: DataTypes.DECIMAL(8, 1),
    allowNull: false,
    defaultValue: 0.0,
    comment: '目前累積點數'
  },
  enable: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 1,
    comment: '啟用/關閉?'
  },
  subs_prod: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    defaultValue: 1,
    comment: '訂閱產品電子報'
  },
  subs_news: {
    type: DataTypes.TINYINT.UNSIGNED,
    allowNull: false,
    defaultValue: 1,
    comment: '訂閱新聞電子報(網站訊息通知)'
  },
  market_rid: {
    type: DataTypes.STRING(16),
    defaultValue: null,
    comment: '美安會員編號'
  },
  market_flag: {
    type: DataTypes.TINYINT,
    allowNull: false,
    defaultValue: 0,
    comment: '美安會員狀態值'
  },
  create_date: {
    type: DataTypes.DATE,
    defaultValue: null,
    comment: '建立時間'
  },
  update_date: {
    type: DataTypes.DATE,
    defaultValue: null,
    comment: '修改時間'
  },
  host: {
    type: DataTypes.STRING(64),
    defaultValue: null,
    comment: '郵件主機'
  },
  host_id: {
    type: DataTypes.INTEGER.UNSIGNED,
    defaultValue: null,
    comment: '郵件主機編號'
  },
  host_verified: {
    type: DataTypes.TINYINT.UNSIGNED,
    defaultValue: 0,
    comment: '是否已驗證過主機'
  }
}, {
  tableName: 'user',
  timestamps: false,
  comment: '會員'
});

// 同步資料庫
sequelize.sync()
  .then(() => {
    console.log('Database & tables created!');
  });

module.exports = User;