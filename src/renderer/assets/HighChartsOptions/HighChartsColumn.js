export default {
  options: {
    chart: {
      type: 'column'
    },
    title: {
      text: '城镇风貌评价结果'
    },
    xAxis: {
      categories: ['整体风貌', '建筑风貌', '道路风貌', '开放空间', '地域文化景观'],
      crosshair: true
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: '得分'
      }
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
        '<td style="padding:0"><b>{point.y:.1f} 分</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0
      }
    },
    series: [{
      name: '城镇',
      data: [70, 82, 75, 64, 71]
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
