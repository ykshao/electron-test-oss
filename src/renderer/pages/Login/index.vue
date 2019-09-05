<template>
  <div class="login drag">
    <div class="content">
      <img src="../../assets/logo.png" alt height="100">
      <el-input class="tk" placeholder="请输入登录口令" v-model="tk"></el-input>
      <el-button class="sub" @click="onSubmit" type="success">提交</el-button>
    </div>
    <!-- <div class="login flex-middle flex-center">
      <div class="bar"></div>
      <div class="loginWarp">
        <div class="logo">
          <div class="img"></div>
          <p class="title">yit-oss 对象信息</p>
        </div>
        <div class="loginContent">
          <el-form
            ref="login"
            label-position="right"
            :rules="loginRule"
            label-width="80px"
            :model="loginData"
          >
            <el-form-item label="存储类型" label-width="150px" prop="region">
              <el-select class="typeSclect" v-model="loginData.region" clearable placeholder="请选择">
                <el-option
                  v-for="item in types"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="bucket名称" label-width="150px" prop="bucket">
              <el-input v-model="loginData.bucket" clearable></el-input>
            </el-form-item>
            <el-form-item label="accessKeyId" label-width="150px" prop="accessKeyId">
              <el-input v-model="loginData.accessKeyId" clearable></el-input>
            </el-form-item>
            <el-form-item label="accessKeySecret" label-width="150px" prop="accessKeySecret">
              <el-input v-model="loginData.accessKeySecret" clearable></el-input>
            </el-form-item>
            <el-form-item class="subBtn">
              <el-button type="primary" @click="onSubmit">确认提交</el-button>
              <el-button @click="resetForm('login')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>-->
  </div>
</template>
<script>
import Vue from "vue";
import { local } from "@/util/util";
import AliOss from "@/util/oss";
import { setTimeout } from "timers";
export default {
  name: "Login",
  data() {
    return {
      tk: '',
      // types: [
      //   { value: "oss-cn-hangzhou", label: "华东 1  oss-cn-hangzhou" },
      //   { value: "oss-cn-shanghai", label: "华东 2  oss-cn-shanghai" },
      //   { value: "oss-cn-qingdao", label: "华北 1  oss-cn-qingdao" },
      //   { value: "oss-cn-beijing", label: "华北 2  oss-cn-beijing" },
      //   { value: "oss-cn-zhangjiakou", label: "华北 3  oss-cn-zhangjiakou" },
      //   { value: "oss-cn-huhehaote", label: "华北 5  oss-cn-huhehaote" },
      //   { value: "oss-cn-shenzhen", label: "华南 1  oss-cn-shenzhen" },
      //   { value: "oss-cn-hongkong", label: "香港  oss-cn-hongkong" }
      // ],
      loginData: {
        region: "oss-cn-beijing",
        accessKeyId: "LTAIIYIAB2Ry2HXy",
        accessKeySecret: "mExptt9cYgB8OFMqRDmxbHJU9Cx0br",
        bucket: "test-fe-shao-oss",
      },
      // loginData: {
      //   region: "oss-cn-hangzhou",
      //   accessKeyId: "LTAInYjOJriBydbq",
      //   accessKeySecret: "VNBcEsW2n4hpB3AG1SPqxqSaSWf5RK",
      //   bucket: "hellosanbao"
      //   // flod:'webFlod'
      // }
      // loginRule: {
      //   region: { trigger: "change", required: true, message: "请选择类型" },
      //   bucket: {
      //     trigger: "blur",
      //     required: true,
      //     message: "请输入bucket名称"
      //   },
      //   accessKeyId: {
      //     trigger: "blur",
      //     required: true,
      //     message: "请输入accessKey"
      //   },
      //   accessKeySecret: {
      //     trigger: "blur",
      //     required: true,
      //     message: "请输入secretKey"
      //   }
      // }
    };
  },
  mounted() {
    // this.onSubmit()
    let loginData = local("OssConfig");
    if (loginData) {
      this.loginData = loginData;
      this.onSubmit();
    }
  },
  methods: {
    // async change() {
    //   let file = this.$refs.file.files[0].path;
    //   let result = await this.alioss.uploadFile(file,'test/ss/aa1.jpg');
    //   console.log(result);
    // },
    async onSubmit() {
      if (this.tk !== '!@#yit2018') {
        this.$message({
          message: "口令错误",
          type: "error",
          duration: 1000
        });
        return
      }
      console.log("logindata------->", this.loginData);

      this.alioss = new AliOss(this.loginData);
      let res = await this.alioss.checkoutLogin();
      if (res.code != 0) {
        this.$message.error(res.message);
      } else {
        //登录成功后将OssConfig存到本地
        local("OssConfig", this.loginData);
        this.$router.replace({ path: "/Home/upload" });
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.bar {
  height: 20px;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  -webkit-app-region: drag;
}
.login {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  // background: url("../../assets/img/loginBg.jpg") no-repeat center/cover;
  z-index: 1000;
  .content {
    width: 200px;
    margin: 100px auto;
    img {
      display: block;
      width: 100px;
      margin: 20px auto;
    }
    .sub {
      width: 200px;
      margin-top: 20px;
    }
  }
  .logo {
    margin: 30px 0;
    .img {
      display: block;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin: 20px auto;
      background: url('../../assets/img/upload.png') no-repeat center/80% auto
        #fff;
    }
    .title {
      font-size: 20px;
      text-align: center;
      color: #666;
    }
  }
  .loginContent {
    width: 500px;
    margin: 0 auto;
    .typeSclect {
      width: 350px;
    }
    .subBtn {
      text-align: right;
    }
  }
}
</style>


