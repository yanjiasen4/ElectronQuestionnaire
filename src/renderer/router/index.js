import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'mainpage',
      component: require('@/components/MainPage').default
    },
    {
      path: '/diagram',
      name: 'diagram',
      component: require('@/components/Diagram').default
    },
    {
      path: '/setting',
      name: 'setting',
      component: require('@/components/Setting').default
    },
    {
      path: '/help',
      name: 'help',
      component: require('@/components/Help').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
