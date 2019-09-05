import Vue from 'vue'
import axios from 'axios'
import remoteObject from '@/util/remoteObject'
import { webFrame } from 'electron'

import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import '@/util/extend'
import '@/assets/css/reset.css'
import '@/assets/css/iconfont/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css';

webFrame.setVisualZoomLevelLimits(1, 1)
webFrame.setLayoutZoomLevelLimits(0, 0)


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

//electron渲染进程api绑定
Vue.prototype.remote = remoteObject

 //element ui组件注册
 Vue.use(ElementUI);

 document.addEventListener('drag',(e)=>{e.preventDefault()})
 document.addEventListener('dragover',(e)=>{e.preventDefault()})
//  document.addEventListener('drag',(e)=>{e.preventDefault()})
//  document.addEventListener('drag',(e)=>{e.preventDefault()})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
