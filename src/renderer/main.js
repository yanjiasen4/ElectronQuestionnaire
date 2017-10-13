import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'

import 'iview/dist/styles/iview.css'
import VueHighcharts from 'vue-highcharts'
import Highcharts from 'highcharts/highstock'
import HighchartsMore from 'highcharts/highcharts-more'
import HighchartsExport from 'highcharts/modules/exporting'
import HighchartsOfflineExport from 'highcharts/modules/offline-exporting'

HighchartsMore(Highcharts)
HighchartsExport(Highcharts)
HighchartsOfflineExport(Highcharts)

Highcharts.setOptions({
  lang: {
    printChart: '打印图表',
    downloadJPEG: '下载JPEG 图片',
    downloadPDF: '下载PDF文档',
    downloadPNG: '下载PNG 图片',
    downloadSVG: '下载SVG 矢量图',
    exportButtonTitle: '导出图片'
  }
})

Vue.use(VueHighcharts, {Highcharts})

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(iView)

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
