const { Sequelize, DataTypes } = require('sequelize');


// const db_user = 'root';
// const db_pwd = 'mysql0322';
// const db_name = 'el_work';

// // 配置 Sequelize 來使用 MySQL 資料庫
// const sequelize = new Sequelize(db_name, db_user, db_pwd, {
//   host: 'localhost',
//   dialect: 'mysql'
// });


const db_user = 'sa';
const db_pwd = 'ns@#admin123';
const db_name = 'NS_MTS';
const db_host = '192.168.1.30'; // 確認這個地址是正確的
const db_port = 1433; // 默認 SQL Server 連接埠

const sequelize = new Sequelize(db_name, db_user, db_pwd, {
  host: db_host,
  port: db_port,
  dialect: 'mssql',

  dialectOptions: {
    options: {
      encrypt: false, // 如果使用加密連接，設置為 true
      trustServerCertificate: true // 如果使用自簽名證書，設置為 true
    }
  }
});


// 測試連線是否成功
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });



// 匯出 sequelize 實例
module.exports = {
  sequelize
};