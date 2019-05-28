<template>
  <div id="app">
    <div class="mask scrollStyle" v-if="hasNewVersion">
      <el-dialog
        :title="showButton?'发现新版本：'+remoteVersion+'，在线更新':'正在更新'"
        :show-close="false"
        :close-on-click-modal="false"
        :visible.sync="addUpdate"
        width="50%"
      >
        <div class="dialog-content scrollStyle" v-if="!showButton">
          <p class="info">
            <i class="el-icon-loading"></i>
            {{curLoad}}
          </p>
          <el-progress :percentage="percent"></el-progress>
        </div>
        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
          <el-button type="primary" v-if="showButton" @click="updateNow()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { remote, app, shell } from "electron";
import fs from "fs-extra";
import { exec } from "child_process";
import unzipper from "unzipper";
import unzip from "unzip2";
import { mapActions } from "vuex";
import {
  oss,
  local,
  getFileType,
  compareVersion,
  getRawFile,
  getLocalVersion
} from "@/util/util";
import remoteObject from "@/util/remoteObject";

const alioss = oss();
//components
import TopBar from "@components/TopBar";
import { get } from "http";
import { error } from "util";

console.log('入口文件');

export default {
  name: "first-project",
  data() {
    return {
      progress: 0,
      localVersion: "0.0.1",
      remoteVersion: "0.0.1",
      updatedFiles: [],
      packageJson: {},
      showButton: true,
      curLoad: "",
      hasNewVersion: false,
      addUpdate: false,
      percent: 0
    };
  },
  components: {
    TopBar
  },
  mounted() {
    this.checkUpdate();
  },
  methods: {
    ...mapActions(["uplaodState", "uploadProgress"]),
    async checkUpdate() {
      const LocalVersion = getLocalVersion();
      let fileRes = await getRawFile("package.json");
      let packageJson = JSON.parse(fileRes);
      this.packageJson = packageJson;
      this.localVersion = LocalVersion;
      this.remoteVersion = packageJson.version;
      let versionDiff = compareVersion(LocalVersion, packageJson.version);
      if (versionDiff) {
        this.hasNewVersion = true;
        if (versionDiff == 1) {
          this.hasNewVersion = false;
          //大版本更新，跳转下载地址
          this.$alert("应用升级：" + this.remoteVersion, "提示", {
            confirmButtonText: "前往下载",
            showClose: false,
            callback: action => {
              shell.openExternal('https://github.com/hellosanbao/electron-yit-oss/releases')
              remote.app.relaunch({ args: process.argv.slice(1) }); // 重启
              remote.app.exit(0);
            }
          });
        } else {
          this.addUpdate = true;
        }
      }
    },
    async updateNow() {
      this.showButton = false;
      let downloadFiles = await this.downPackage(
        this.packageJson.updateInfo.fileList
      );
      this.addUpdate = false;
      this.hasNewVersion = false;
      //更新版本号
      local('appVersion', this.remoteVersion)
      this.$alert("更新完成需要重新启动应用生效" + remote.app.getVersion(), "提示", {
        confirmButtonText: "关闭应用",
        showClose: false,
        callback: action => {
          remote.app.relaunch({ args: process.argv.slice(1) }); // 重启
          remote.app.exit(0);
        }
      });
    },
    async downPackage(fileList) {
      let tmp = remote.app.getPath("temp");
      let dir = fs.mkdtempSync(`${tmp}upgrade_`);
      let outDir =
        process.env.NODE_ENV === "development"
          ? process.cwd() + "/aaaa"
          : __dirname;
      return new Promise((resolve, reject) => {
        try {
          let remotefiles = [];
          fileList.forEach(async (filepath, index) => {
            let file = await getRawFile(filepath);
            let dirFilepath = filepath.replace("dist/electron/", "");
            fs.outputFileSync(dir + "/" + dirFilepath, file);
            this.curLoad = filepath;
            this.updatedFiles.push(this.curLoad);
            this.percent = Math.floor(
              (this.updatedFiles.length / fileList.length) * 100
            );
            remotefiles.push(file);
            if (remotefiles.length == fileList.length) {
              fs.copySync(dir, outDir);
              fs.removeSync(dir);
              resolve(remotefiles);
            }
          });
        } catch (err) {
          alert("更新失败：" + err.message);
        }
      });
    },
    async upload(paths) {
      const vm = this;
      let ps = paths.filter(item => getFileType(item));
      this.uplaodState(true);
      alioss.uploadCommon(ps, {
        finishOne(p) {
          vm.uploadProgress(p);
        },
        uploadEnd() {
          vm.uploadProgress(0);
          vm.uplaodState(false);
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
#app {
  height: 100vh;
}
.mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 999999;
  background: rgba(255, 255, 255, 0.5);
  overflow: scroll;
  .dialog-content {
    .info {
      color: #fff;
      margin-bottom: 10px;
      i {
        color: #67c23a;
        margin-right: 10px;
      }
    }
  }
}
</style>

