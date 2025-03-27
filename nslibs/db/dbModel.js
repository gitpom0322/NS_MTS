const { ipcMain } = require('electron');

require('./func/manager'); // 引入 manager 功能
require('./func/users'); // 引入 users 功能
require('./func/messages'); // 引入 messages 功能


require('./func/cck_cars_manager'); // 引入 cck 車輛管理