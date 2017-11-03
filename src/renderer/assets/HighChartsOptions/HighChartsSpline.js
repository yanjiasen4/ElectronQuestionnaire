export default {
  options: {
    title: {
      text: '城镇风貌评价结果',
      x: -20
    },
    xAxis: {
      categories: ['整体风貌', '建筑风貌', '道路风貌', '开放空间', '地域文化景观', '城镇风貌综合评分']
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: '得分'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      borderWidth: 0
    },
    series: [],
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ['printChart', 'separator', 'downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG', 'separator', 'downloadExcel']
        }
      }
    }
  }
}
