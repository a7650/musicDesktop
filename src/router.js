import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: () => import('components/home/home'),
    },
      {
        name:'discDetail',
        path:'/home/:id',
        component:()=>import('components/discDetail/discDetail')
      },
    {
      path: '/singer',
      component: () => import('components/singer/singer')
    },
    {
      name:'singerDetail',
      path: '/singer/:id',
      component: () => import('components/singerDetail/singerDetail')
    },
    {
      path: '/rank',
      component: () => import('components/rank/rank')
    },
    {
      path: '/mine',
      component: () => import('components/mine/mine')
    }
  ]
})
