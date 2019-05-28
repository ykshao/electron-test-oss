<template>
  <div class="ImgList" v-loading="showLoading" element-loading-background="rgba(0, 0, 0, .5)">
    <div class="toolbar flex-middle flex-between">
      <p :class="['prev flex-middle',{'noPrev':!currentDir}]" @click="prevPage">
        <i class="iconfont iconxiayige"></i> 返回上层目录
      </p>
      <div class="menu">
        <el-tooltip class="item" effect="dark" content="上传文件到当前文件夹" placement="bottom">
          <i @click="showFlodDilag" class="menuBtn iconfont iconshangchuan1"></i>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" content="新建文件夹" placement="bottom">
          <i class="menuBtn iconfont iconxinjianwenjianjia" @click="showNewDilag()"></i>
        </el-tooltip>
        <i :class="['menuBtn iconfont iconmulu',{'active':showSimple}]" @click="showSimple = true"></i>
        <i
          :class="['menuBtn iconfont iconresourceCatalog-icon',{'active':!showSimple}]"
          @click="showSimple = false"
        ></i>
        <i :class="['menuBtn iconfont iconrefresh']" @click="refresh()"></i>
      </div>
    </div>
    <div :class="['listContent','scrollStyle',{'simple':showSimple,'flex-content':!showSimple}]">
      <div v-if="noFiles" class="noFiles">获取文件失败</div>
      <div
        :path="item.path"
        @click="handleClickItem(item)"
        :class="['item',{'flex-middle':showSimple}]"
        :key="index"
        v-for="(item, index) in list"
      >
        <div class="info-con">
          <div
            :path="item.path"
            :class="['icon',{'img':item.name.isimg()}]"
            :style="[{backgroundImage:`url(${item.icon})`},showSimple?{}:!item.etx?{}:{backgroundSize:`${item.width>70?70:item.width}px auto`}]"
          ></div>
          <p
            v-if="item.name.isimg()"
            :path="item.path"
            class="size line-clamp1"
          >{{item.width}} x {{item.height}}</p>
          <p :path="item.path" class="title line-clamp2">{{item.name}}</p>
        </div>
        <div class="info-opt">
          <el-button
            type="success"
            size="mini"
            v-if="item.etx"
            @click.stop.prevent="copyUrl(item.url)"
            :path="item.path"
          >复制链接</el-button>
          <el-button v-else type="danger" size="mini" @click.stop.prevent="deleteDir(item)">删除</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="新建文件夹" :append-to-body="true" :visible.sync="newDirDilag" width="40%">
      <el-input :autofocus="true" size="mini" placeholder="输入文件夹名称" v-model="newDirname" clearable></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="newDirDilag = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="mkDir(newDirname)">创 建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { ipcRenderer, remote, clipboard } from "electron";
import { oss, getFileType, local } from "@/util/util";
import remoteObject from "@/util/remoteObject";
import extlist from "@/util/extlist";
import { resolve } from "dns";
const alioss = oss();

export default {
  name: "ImgList",
  data() {
    return {
      showSimple: local("showSimple"),
      list: [],
      currentDir: "",
      showLoading: true,
      newDirDilag: false,
      newDirname: "",
      noFiles: false
    };
  },
  async mounted() {
    await this.getFlodList();
    this.showLoading = false;

    this.$nextTick(() => {
      // let MenuList = [
      //   {
      //     label: "删除",
      //     click: async () => {
      //       this.showLoading = true;
      //       let res = await alioss.delFile(this.path);
      //       await this.getFlodList(this.currentDir);
      //       if (res.code != -1) {
      //         this.$message({
      //           message: "删除成功",
      //           type: "success",
      //           duration: 1000
      //         });
      //       }
      //       this.showLoading = false;
      //     }
      //   }
      // ];
      // document.onmousedown = async event => {
      //   if (event.button == 2) {
      //     this.path = event.target.getAttribute("path");
      //     if (this.path) {
      //       let menu = remoteObject.showRightMenu(MenuList);
      //       menu.popup(remote.getCurrentWindow());
      //     }
      //   }
      // };
    });
  },
  methods: {
    showNewDilag() {
      this.newDirDilag = true;
    },
    async mkDir(dir) {
      this.newDirname = "";
      this.newDirDilag = false;
      if (!dir) return;
      await alioss.mkDir(`${this.currentDir}${dir}`);
      this.getFlodList(this.currentDir);
    },
    showFlodDilag() {
      if (!this.currentDir) {
        this.$message({
          message: "不允许上传到根目录",
          type: "error",
          duration: 1000
        });
        return;
      }
      let vm = this;
      remoteObject.showFlodDilag().then(paths => {
        if (paths) {
          vm.showLoading = true;
          alioss.uploadCommon(paths, {
            flod: vm.currentDir || "/",
            uploadEnd() {
              vm.showLoading = false;
              vm.getFlodList(vm.currentDir);
            }
          });
        }
      });
    },
    copyUrl(text) {
      clipboard.writeText(text);
      this.$message({
        message: "已复制到剪贴板",
        type: "success",
        duration: 1000
      });
    },
    prevPage() {
      if (!this.currentDir) return;
      let preDir = this.currentDir.replace(this.currentDir.pathname() + "/", "");
      this.getFlodList(preDir);
    },
    async getFlodList(dir = "") {
      this.currentDir = dir;
      let res = await alioss.getDirList(dir);
      if (!res) {
        this.noFiles = true;
        this.list = [];
        return;
      }

      this.noFiles = false;
      let objects = res.objects;
      let prefixes = res.prefixes;
      let list = [];

      if (prefixes) {
        list = prefixes.map(item => {
          return {
            name: item.pathname(),
            path: item,
            etx: "",
            icon: `static/img/flod.png`,
            url: item.url
          };
        });
      }

      if (objects) {
        objects.forEach(async item => {
          item.url = 'https://test-fe-shao-oss.oss-cn-beijing.aliyuncs.com/' + item.name
          let icon = `static/img/file.png`;
          if (item.name.isimg()) {
            icon = item.url;
          }
          let imgObject = await this.loadImageSync(icon);
          if (getFileType(item.name)) {
            list.push({
              name: item.name.pathname(),
              path: item.name,
              etx: getFileType(item.name),
              icon,
              width: imgObject.width,
              height: imgObject.height,
              url: item.url
            });
          }
        });
      }

      this.list = list;
    },
    loadImageSync(url) {
      return new Promise(resolve => {
        let imgObject = new Image();
        imgObject.src = url;
        imgObject.onload = () => {
          resolve(imgObject);
        };
      });
    },
    handleClickItem(item) {
      if (!item.etx) {
        this.getFlodList(item.path);
      }
    },
    async deleteDir(item) {
      console.log('要删除的项目------>', item);
      this.showLoading = true;
      let res = await alioss.delFile(item.path);
      await this.refresh();
      if (res.code != -1) {
        this.$message({
          message: "删除成功",
          type: "success",
          duration: 1000
        });
      }
      this.showLoading = false;
    },
    async refresh() {
      console.log('当前的目录------->', this.currentDir);
      await this.getFlodList(this.currentDir);
    }
  },
  watch: {
    showSimple(n) {
      local("showSimple", n);
    }
  }
};
</script>

<style lang="scss" scoped>
.ImgList {
  height: 100%;
  overflow-x: hidden;
  .toolbar {
    height: 40px;
    cursor: pointer;
    color: #fff;
    padding: 0 10px;
    @include border-bottom(#606060);
    .prev {
      font-size: 13px;
      &.noPrev {
        color: #606060;
      }
      .iconfont {
        margin-right: 3px;
        font-size: 13px;
      }
    }
    .menuBtn {
      padding: 10px;
      font-weight: bold;
      &:hover {
        color: $primyColor;
      }
      &.active {
        color: $primyColor;
      }
      &.iconmulu {
        font-size: 19px;
        margin-top: -5px;
      }
    }
  }
  .listContent {
    height: 100%;
    overflow-y: scroll;
    .noFiles {
      color: #b0b0b0;
      width: 100%;
      text-align: center;
      line-height: 200px;
      font-size: 14px;
    }
    &.simple {
      .item {
        padding: 10px 0;
        margin-left: 20px;
        color: #fff;
        font-size: 12px;
        cursor: default;
        @include border-bottom(#606060);
        justify-content: space-between;
        &:hover {
          color: $primyColor;
        }
        .info-con {
          display: flex;
          align-items: center;
        }
        .icon {
          display: block;
          width: 25px;
          height: 25px;
          margin-right: 10px;
          background: no-repeat center/100% auto;
          border-radius: 4px;
          &.img {
            background: no-repeat center/80% auto rgba(255, 255, 255, 0.3);
          }
          .copy {
            display: none;
          }
        }
        .size {
          margin-right: 10px;
          font-size: 10px;
        }
      }
    }
    &.flex-content {
      align-content: flex-start;
      .item {
        width: 90px;
        margin: 10px 20px;
        align-self: flex-start;
        &:hover {
          color: $primyColor;
        }
        .info-opt {
          margin-top: 10px;
          text-align: center;
        }
        .icon {
          display: block;
          width: 70px;
          height: 70px;
          margin: 0 auto;
          background: no-repeat center/80% auto;
          border-radius: 4px;
          transition: transform 0.3s;
          overflow: hidden;
          &.img {
            background: no-repeat center/80% auto rgba(255, 255, 255, 0.3);
          }
        }
        .size {
          font-size: 10px;
          color: #fff;
          text-align: center;
          padding: 5px 0;
        }

        .title {
          font-size: 12px;
          color: #fff;
          text-align: center;
          word-break: break-all;
        }
      }
    }
  }
}
</style>


