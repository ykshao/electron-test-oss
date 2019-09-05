<template>
  <div class="BucketSeting">
    <div class="title">图床设置</div>
    <div class="setingContent">
      <el-form
        ref="login"
        label-position="right"
        :rules="loginRule"
        label-width="150px"
        :model="loginData"
      >
        <el-form-item label="存储类型" prop="region">
          <el-select class="typeSclect" v-model="loginData.region" placeholder="请选择">
            <el-option
              v-for="item in types"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="formItem" label="bucket名称" prop="bucket">
          <el-input v-model="loginData.bucket" clearable></el-input>
        </el-form-item>
        <el-form-item class="formItem" label="accessKeyId" prop="accessKeyId">
          <el-input v-model="loginData.accessKeyId" placeholder="accessKeyId" clearable></el-input>
        </el-form-item>
        <el-form-item class="formItem" label="accessKeySecret" prop="accessKeySecret">
          <el-input v-model="loginData.accessKeySecret" placeholder="accessKeySecret" clearable></el-input>
        </el-form-item>
        <el-form-item class="formItem" label="上传路径" prop="flod">
          <el-input v-model="loginData.flod" placeholder="上传路径，如：test/" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">确认设置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { local } from "@/util/util";
import AliOss from "@/util/oss";

let { flod } = local("OssConfig");

export default {
  name: "BucketSeting",
  data() {
    return {
      types: [
        { value: "oss-cn-hangzhou", label: "华东 1  oss-cn-hangzhou" },
        { value: "oss-cn-shanghai", label: "华东 2  oss-cn-shanghai" },
        { value: "oss-cn-qingdao", label: "华北 1  oss-cn-qingdao" },
        { value: "oss-cn-beijing", label: "华北 2  oss-cn-beijing" },
        { value: "oss-cn-zhangjiakou", label: "华北 3  oss-cn-zhangjiakou" },
        { value: "oss-cn-huhehaote", label: "华北 5  oss-cn-huhehaote" },
        { value: "oss-cn-shenzhen", label: "华南 1  oss-cn-shenzhen" },
        { value: "oss-cn-hongkong", label: "香港  oss-cn-hongkong" }
      ],
      loginData: {
        region: "",
        accessKeyId: "",
        accessKeySecret: "",
        bucket: "",
        flod: flod || ''
      },
      loginRule: {
        region: { trigger: "change", required: true, message: "请选择类型" },
        bucket: {
          trigger: "blur",
          required: true,
          message: "请输入bucket名称"
        },
        accessKeyId: {
          trigger: "blur",
          required: true,
          message: "请输入accessKey"
        },
        accessKeySecret: {
          trigger: "blur",
          required: true,
          message: "请输入secretKey"
        }
      }
    };
  },
  mounted() {
    local('OssConfig') && (this.loginData = local('OssConfig'))
  },
  methods: {
    async onSubmit() {
      this.alioss = new AliOss(this.loginData);
      let res = await this.alioss.checkoutLogin();
      if (res.code != 0) {
        this.$message.error(res.message);
      } else {
        let flodarr = this.loginData.flod.split("")
        if (flodarr[flodarr.length - 1] != '/' && this.loginData.flod) {
          this.loginData.flod = this.loginData.flod + '/'
        }
        //登录成功后将OssConfig存到本地
        local("OssConfig", this.loginData);
        this.$message({
          message: '设置成功',
          type: 'success'
        });
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.BucketSeting {
  .title {
    color: #fff;
    font-size: 18px;
    text-align: center;
    line-height: 50px;
  }
  .setingContent {
    .formItem {
      width: 500px;
    }
    .typeSclect {
      width: 350px;
    }
  }
}
</style>


