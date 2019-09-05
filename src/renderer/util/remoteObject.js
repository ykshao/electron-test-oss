const {
  BrowserWindow,
  getCurrentWindow,
  Notification,
  Menu,
  MenuItem,
  dialog
} = require('electron').remote;

const path = require('path');

//native bridje
export default {
  /**
   * 打开一个新的窗口
   * @param {Object} opt 与BrowserWindow的参数一直
   */
  openWindow(opt) {
    return new BrowserWindow(opt);
  },

  /**
   * 设置顶部菜单
   * @param {array} template 顶部菜单数组
   */
  setTopMenu(template) {
    let menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  },

  /**
   * 设置右键菜单
   */
  setRightMouseClick(template, callBack) {
    window.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      callBack && callBack(e);
      let menu = Menu.buildFromTemplate(template);
      menu.popup({ window: getCurrentWindow() });
    });
  },
  /**
   * 错误弹窗
   */
  errorAlert(content = '错误提示', title = 'error') {
    dialog.showErrorBox(title, content);
  },
  /**
   * 显示文件选择器
   */
  showFlodDilag() {
    return new Promise((resolve, reject) => {
      dialog.showOpenDialog(
        {
          title: '选择要上传的图片',
          properties: ['openFile', 'multiSelections']
        },
        filePaths => {
          resolve(filePaths);
        }
      );
    });
  },

  showConfirm(message, label) {
    return new Promise((resolve, reject) => {
      let option = {
        type: 'warning',
        message,
        buttons: ['确定', '取消']
      };
      if (label) {
        option.checkboxLabel = label;
      }
      dialog.showMessageBox(option, (index, checked) => {
        if (index == 0) {
          resolve(checked);
        } else {
          reject('取消');
        }
      });
    });
  },

  /**
   * 全局通知
   */
  showNotification(title, subtitle) {
    const notification = new Notification({
      title,
      subtitle,
      icon: path.join(__dirname, '../../main/upload.png')
    });
    notification.show();
  },
  /**
   * 打开右键菜单
   * @param {array} menuItems 菜单项数组
   */
  showRightMenu(menuItems = []) {
    const menu = new Menu();
    menuItems.forEach(item => {
      menu.append(new MenuItem(item));
    });
    return menu;
  }
};
