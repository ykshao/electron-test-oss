<template>
  <div class="List">
    <router-link to="/Home">Home</router-link>
    <button @click="openNewWin()">打开新窗口</button>
    <h1 class="List">List</h1>
    <div class="tcp">
      <h3 class="title">主进程与渲染进程通讯</h3>
      <div class="button" @click="senMessageToMain('来自list的消息')">发送信息到主进程</div>
      <div class="reply">{{reply}}</div>
    </div>
    <div class="shell">
      <h3 class="title">Shell模块打开浏览器</h3>
      <div
        class="button"
        @click="openUrl('http://zhuishushenqi.mendada.cn')"
      >http://zhuishushenqi.mendada.cn</div>
    </div>
    <div class="dialog">
      <h3 class="title">Dialog</h3>
      <div class="button" @click="dialogError('错误信息')">错误提示信息</div>
      <div class="button" @click="dialogMessage('info信息')">info提示信息</div>
    </div>

    <!-- <webview src='http://zhuishushenqi.mendada.cn' style="width:414px;height:768px;"></webview> -->
  </div>
</template>

<script>
import { ipcRenderer, shell } from "electron";
const { dialog } = require('electron').remote
let template = vm => {
  return [
    {
      label: "文件1",
      submenu: [
        {
          label: "新建窗口",
          click() {
            vm.openNewWin();
          }
        }
      ]
    },
    {
      label: "文件",
      submenu: [
        {
          label: "复制",
          role: "copy"
        },
        {
          label: "剪切",
          role: "cut"
        }
      ]
    },
    {
      label: "查看",
      submenu: [
        {
          label: "窗口",
          role: "windowMenu"
        }
      ]
    },
    {
      label: "视图",
      submenu: [
        {
          label: "最小化",
          role: "minimize"
        },
        {
          label: "重置窗口大小",
          type: "checkbox"
        }
      ]
    }
  ];
};
export default {
  name: "List",
  data() {
    return {
      reply: ""
    };
  },
  mounted() {
    this.remote.setTopMenu(template(this));
    this.remote.setRightMouseClick(template(this), e => {
      console.log(e, 1111);
    });

    //接受主进程的响应
    ipcRenderer.on("replay", (event, data) => {
      this.reply = data;
    });
  },
  methods: {
    openNewWin() {
      let win = this.remote.openWindow({ width: 800, height: 400 });
      win.loadURL("http://localhost:9080/#/Home");

      //新窗口加载完毕后执行
      win.webContents.on("did-finish-load", () => {
        win.webContents.send("renderHome", "来自渲染进程list的数据");
      });
    },
    senMessageToMain(msg) {
      this.reply = "信息已发送到主进程，等待响应...";
      //渲染进程广播事件
      ipcRenderer.send("sendM", msg);
    },
    //使用默认浏览器打开url
    openUrl(url) {
      shell.openExternal(url);
    },
    dialogError(content) {
      dialog.showErrorBox('error', content)
    },
    dialogMessage(content) {
      dialog.showMessageBox({
        title: '信息',
        type: 'info',
        message: content,
        buttons: ['确定', '取消']
      }, (index) => {
        console.log(index)
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  color: #fff;
  background: #f30;
  padding: 15px 30px;
}
.reply {
  width: 300px;
  height: 100px;
  padding: 10px;
  border: 1px solid #d7d7d7;
  border-radius: 10px;
  margin-top: 10px;
}
.button {
  background: blue;
  color: #fff;
  padding: 15px 30px;
  display: inline-block;
  border-radius: 5px;
  cursor: pointer;
}
</style>



