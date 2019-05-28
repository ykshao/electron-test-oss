const { ipcMain, Tray } = require('electron');

let tray = null;
ipcMain.on('creatTray', (event, data) => {
  if (tray) {
    tray.destroy();
  }
  tray = new Tray(require('path').join(__static, './img/upload.png'));
  tray.on('drop-files', async (devent, files) => {
    event.sender.send('tray-drop-files', files);
    // this.upload(files);
  });
});

ipcMain.on('sendM', (event, data) => {
  setTimeout(() => {
    event.sender.send('replay', '主进程已接收到数据！');
  }, 1000);
});
