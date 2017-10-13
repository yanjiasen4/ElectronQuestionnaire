export default {
  options: {
    chart: {
      polar: true,
      type: 'line'
    },
    title: {
      text: '城镇风貌评价结果 - 雷达图',
      x: -80
    },
    pane: {
      size: '80%'
    },
    xAxis: {
      categories: ['整体风貌', '建筑风貌', '道路风貌', '开放空间', '地域文化景观'],
      tickmarkPlacement: 'on',
      lineWidth: 0
    },
    yAxis: {
      gridLineInterpolation: 'polygon',
      lineWidth: 0,
      max: 100,
      min: 0,
      tickInterval: 25
    },
    tooltip: {
      shared: true,
      pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}分</b><br/>'
    },
    legend: {
      align: 'right',
      verticalAlign: 'top',
      y: 70,
      layout: 'vertical'
    },
    series: [{
      name: '城镇',
      data: [],
      pointPlacement: 'on'
    }],
    exporting: {
      buttons: {
        contextButton: {
          menuItems: ['printChart', 'separator', 'downloadPNG', 'downloadJPEG', 'downloadPDF', 'downloadSVG', 'separator', 'downloadExcel']
        }
      }
    }
  }
}
