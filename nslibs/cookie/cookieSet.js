const { ipcMain, session } = require('electron');


// 讀取 Cookie 的 IPC 通道
ipcMain.handle('get-cookie', async (event, cookieName) => {
    const cookies = await session.defaultSession.cookies.get({ name: cookieName });
    return cookies.length ? cookies[0].value : 'abcd';
});


// 寫入 Cookie 的 IPC 通道
ipcMain.handle('set-cookie', async (event, cookie) => {
    try {
        await session.defaultSession.cookies.set(cookie);
        return { success: true };
    } catch (error) {
        console.error('Error setting cookie:', error);
        return { success: false, error: error.message };
    }
});