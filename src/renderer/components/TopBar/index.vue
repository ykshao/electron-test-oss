<template>
  <div class="bar">
    <div class="title">yit-oss</div>
    <div class="tool flex-middle">
      <div class="upload" type="primary">
        上传文件
        <i class="el-icon-upload el-icon--right"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { oss } from "@/util/util"
export default {
  name: "TopBar",
  mounted() {
    //实例化云上传函数
    this.qiniuoss = oss();
  },
  methods: {
    back() {
      console.log(this.$router);
      this.$router.go(-1);
    },
    next() {
      this.$router.go(-1);
    }
  }
};
</script>


<style lang="scss" scoped>
.bar {
  height: 60px;
  -webkit-app-region: drag;
  background: #f6f6f6;
  .title {
    text-align: center;
    height: 25px;
    line-height: 25px;
    color: #666;
  }
  .tool {
    padding: 5px 10px 0;
    .upload {
      height: 21px;
      line-height: 21px;
      font-size: 12px;
      background: #409eff;
      color: #fff;
      padding: 0 15px;
      border-radius: 4px;
    }
  }
}
</style>
