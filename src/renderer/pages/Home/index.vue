<template>
  <div class="Home flex">
    <div class="leftMenu scrollStyle drag">
      <router-link tag="div" to="imgList" class="item">
        <i class="iconfont iconicontupian"></i>文件目录
      </router-link>
      <router-link tag="div" to="BucketSeting" class="item">
        <i class="iconfont iconshezhi"></i>设置
      </router-link>
      <!-- <router-link tag="div" to="AppSeting" class="item"><i class="iconfont iconleimupinleifenleileibie"></i>系统设置</router-link> -->
    </div>
    <div class="rightContent flex1">
      <div class="title">新东方在线云教室前端团队</div>
      <router-view class="routerContent"></router-view>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { oss } from "@/util/util";
const path = require("path");

export default {
  name: "Home",
  data() {
    return {
      msg: ""
    };
  },
  mounted() {
    // 实例化云上传函数
    // this.qiniuoss = oss();
    ipcRenderer.on("renderHome", (event, data) => {
      this.msg = data;
    });
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.Home {
  height: 100vh;
}
.leftMenu {
  padding-top: 30px;
  width: 200px;
  background: #414142;
  color: #fff;
  overflow-y: scroll;
  .item {
    height: 30px;
    line-height: 30px;
    font-size: 15px;
    padding-left: 30px;
    padding-top: 20px;
    display: block;
    &.router-link-active {
      color: $primyColor;
    }
    .iconfont {
      margin-right: 10px;
      font-size: 16px;
      display: inline-block;
      width: 25px;
      &.iconshezhi {
        font-size: 18px;
      }
    }
  }
}
.rightContent {
  background: #2f393c;
  height: 100%;
  .title {
    color: #fff;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
  .routerContent {
    height: 100%;
  }
}
</style>