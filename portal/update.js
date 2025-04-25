const { dialog } = require('electron');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');

function setupAutoUpdater(mainWindow) {
  // 設置自動更新日誌
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';
  log.info('應用程式啟動, 檢查更新...');

  // 在應用啟動時檢查更新
  autoUpdater.checkForUpdatesAndNotify();

  // 自動更新事件處理
  autoUpdater.on('update-available', (info) => {
    log.info('有可用的更新:', info);
    dialog.showMessageBox({
      type: 'info',
      title: '更新可用',
      message: '有新的版本可用，正在下載更新...',
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    log.info('更新下載完成:', info);
    dialog
      .showMessageBox({
        type: 'info',
        title: '更新已準備好',
        message: '更新已下載完成，是否立即安裝並重啟應用？',
        buttons: ['是', '否'],
      })
      .then((result) => {
        if (result.response === 0) {
          // 用戶選擇「是」，安裝更新並重啟應用
          autoUpdater.quitAndInstall();
        } else {
          // 用戶選擇「否」，記錄用戶拒絕更新的行為
          log.info('用戶選擇稍後更新');
        }
      });
  });

  autoUpdater.on('error', (error) => {
    log.error('自動更新錯誤:', error);
    dialog.showErrorBox('更新錯誤', error == null ? '未知錯誤' : error.toString());
  });
}

module.exports = { setupAutoUpdater };