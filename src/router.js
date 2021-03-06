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
      name: 'discDetail',
      path: '/home/:id',
      component: () => import('components/discDetail/discDetail')
    },
    {
      path: '/singer',
      component: () => import('components/singer/singer')
    },
    {
      name: 'singerDetail',
      path: '/singer/:id',
      component: () => import('components/singerDetail/singerDetail')
    },
    {
      path: '/rank',
      component: () => import('components/rank/rank'),
      children: [
        {
          name: 'rankDetail',
          path: ':id',
          component: () => import('components/rankDetail/rankDetail')
        }
      ]
    },
    {
      path: '/collectRank',
      component: () => import('components/collectRank/collectRank')
    },
    {
      name: 'discDetail_rank',
      path: '/collectRank/:id',
      component: () => import('components/discDetail/discDetail')
    },
    {
      path: '/mine',
      component: () => import('components/mine/mine')
    },
    {
      name: 'discDetail_mine',
      path: '/mine/:id',
      component: () => import('components/discDetail/discDetail')
    },
    {
      name: 'search',
      path: '/search',
      component: () => import('components/search/search')
    },
    {
      name:"zhida",
      path:"/zhida/:id",
      component: () => import('components/singerDetail/singerDetail')
    },
    {
      name: "adm",
      path: "/adm",
      component: () => import('components/adm/index')
    },
    {
      name: 'admSong',
      path: '/adm/song',
      component: () => import('components/adm/song')
    },
    {
      name: 'admUser',
      path: '/adm/user',
      component: () => import('components/adm/user')
    },
    {
      name: 'admSinger',
      path: '/adm/singer',
      component: () => import('components/adm/singer')
    }
  ]
})
