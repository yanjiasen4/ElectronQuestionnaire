import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: require('@/components/Welcome').default
    },
    {
      path: '/mainpage',
      name: 'mainpage',
      component: require('@/components/MainPage').default
    },
    {
      path: '/diagram',
      name: 'diagram',
      component: require('@/components/Diagram').default
    },
    {
      path: '/setting-parm',
      name: 'setting-parm',
      component: require('@/components/Setting').default
    },
    {
      path: '/help',
      name: 'help',
      component: require('@/components/Help').default
    },
    {
      path: '/loading',
      name: 'loading',
      component: require('@/components/Loading').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
