(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{158:function(t,e,n){var a=n(167);"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);(0,n(15).default)("44e8fbe4",a,!0,{})},165:function(t,e,n){t.exports=n.p+"imgs/logo--assets.png"},166:function(t,e,n){"use strict";var a=n(158);n.n(a).a},167:function(t,e,n){var a=n(44);(t.exports=n(14)(!1)).push([t.i,".bar[data-v-00e8f59d]{height:20px;position:absolute;left:0;top:0;width:100%;-webkit-app-region:drag}.login[data-v-00e8f59d]{position:fixed;left:0;right:0;bottom:0;top:0;z-index:1000}.login .content[data-v-00e8f59d]{width:200px;margin:100px auto}.login .content img[data-v-00e8f59d]{display:block;width:100px;margin:20px auto}.login .content .sub[data-v-00e8f59d]{width:200px;margin-top:20px}.login .logo[data-v-00e8f59d]{margin:30px 0}.login .logo .img[data-v-00e8f59d]{display:block;width:50px;height:50px;border-radius:50%;margin:20px auto;background:url("+a(n(168))+") no-repeat 50%/80% auto #fff}.login .logo .title[data-v-00e8f59d]{font-size:20px;text-align:center;color:#666}.login .loginContent[data-v-00e8f59d]{width:500px;margin:0 auto}.login .loginContent .typeSclect[data-v-00e8f59d]{width:350px}.login .loginContent .subBtn[data-v-00e8f59d]{text-align:right}",""])},168:function(t,e,n){t.exports=n.p+"imgs/upload--img.png"},175:function(t,e,n){"use strict";n.r(e);var a=n(0),o=n.n(a),i=n(1),s=n.n(i),r=n(4),l=n(45),c=(n(154),n(166),n(21)),g=Object(c.a)({name:"Login",data:function(){return{tk:"",loginData:{region:"oss-cn-beijing",accessKeyId:"LTAIIYIAB2Ry2HXy",accessKeySecret:"mExptt9cYgB8OFMqRDmxbHJU9Cx0br",bucket:"test-fe-shao-oss"}}},mounted:function(){var t=Object(r.e)("OssConfig");t&&(this.loginData=t,this.onSubmit())},methods:{onSubmit:function(){var t=this;return s()(o.a.mark(function e(){var n;return o.a.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if("!@#yit2018"===t.tk){e.next=3;break}return t.$message({message:"口令错误",type:"error",duration:1e3}),e.abrupt("return");case 3:return console.log("logindata-------\x3e",t.loginData),t.alioss=new l.a(t.loginData),e.next=7,t.alioss.checkoutLogin();case 7:0==(n=e.sent).code?(Object(r.e)("OssConfig",t.loginData),t.$router.replace({path:"/Home/upload"})):t.$message.error(n.message);case 9:case"end":return e.stop()}},e,t)}))()},resetForm:function(t){this.$refs[t].resetFields()}}},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"login drag"},[a("div",{staticClass:"content"},[a("img",{attrs:{src:n(165),alt:"",height:"100"}}),t._v(" "),a("el-input",{staticClass:"tk",attrs:{placeholder:"请输入登录口令"},model:{value:t.tk,callback:function(e){t.tk=e},expression:"tk"}}),t._v(" "),a("el-button",{staticClass:"sub",attrs:{type:"success"},on:{click:t.onSubmit}},[t._v("提交")])],1)])},[],!1,null,"00e8f59d",null);e.default=g.exports}}]);