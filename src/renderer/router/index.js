import Vue from 'vue'
import Router from 'vue-router'
import { local } from '@/util/util'
 

const Home = ()=> import(/* webpackChunkName: "group-Home" */ '@/pages/Home')
const List = ()=> import(/* webpackChunkName: "group-List" */ '@/pages/List')
const Login = ()=> import(/* webpackChunkName: "group-Login" */ '@/pages/Login')
const ImgList = ()=> import(/* webpackChunkName: "group-ImgList" */ '@/pages/Home/view/ImgList')
const BucketSeting = ()=> import(/* webpackChunkName: "group-BucketSeting" */ '@/pages/Home/view/BucketSeting')
const AppSeting = ()=> import(/* webpackChunkName: "group-AppSeting" */ '@/pages/Home/view/AppSeting')
// import Home from '@/pages/Home'
// import List from '@/pages/List'
// import Login from '@/pages/Login'
// import Upload from '@/pages/Home/view/Upload'
// import ImgList from '@/pages/Home/view/ImgList'
// import BucketSeting from '@/pages/Home/view/BucketSeting'
// import AppSeting from '@/pages/Home/view/AppSeting'

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      children:[
        {
          path:'imgList',
          component:ImgList
        },
        {
          path:'BucketSeting',
          component:BucketSeting
        },
        {
          path:'AppSeting',
          component:AppSeting
        },
      ]
    },
    {
      path: '/List',
      name: 'List',
      component: List
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '*',
      redirect: '/Home/imgList'
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(!local('OssConfig') && to.path!='/Login'){
    next({path:'/Login',replace: true})
  }else{
    next()
  }
})

export default router
