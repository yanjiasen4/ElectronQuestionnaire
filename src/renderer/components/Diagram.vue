<template>
  <div class="layout">
    <top-menu v-bind:page="'diagram'"></top-menu>
    <div class="layout-content">
      <Row class="result-intro">
        <Col span="5">
          <Menu active-name="total" width="auto" @on-select="switchAspect">
            <MenuItem name="total">
              <span class="layout-text">城镇风貌综合评价结果</span>
            </MenuItem>
            <MenuItem v-for="(item, index) in aspectArray" :name="index" :key="item.name">
              <span class="layout-text">{{ item.name }}评价结果</span>
            </MenuItem>
          </Menu>
        </Col>
        <Col span="19" class="result-content">
          <header class="result-header">
            <span v-if="currSelect === 'total'">
              城镇风貌综合质量
              <Button size="large">{{ totalLevel }}</Button>
            </span>
            <span v-else>
              {{ rootLevel[parseInt(currSelect)].name }}
              <Button size="large">{{ rootLevel[parseInt(currSelect)].level }}</Button>
            </span>
          </header>
          <Row class="detail-intro" v-for="(item, index) in currLevel" v-if="index % 3 === 0" :key="item.name">
            <Col span="8" class="sub-level" v-for="i in [0,1,2]" v-if="index + i < currLevel.length" :key="i">
              <span>
                {{ currLevel[index + i].name }}
              </span>
              <Button size="large" class="fix">{{ currLevel[index + i].level }}</Button>
            </Col>
          </Row>
          <Row>
            <Tabs value="column" class="diagram">
              <TabPane label="柱状图" name="column">
                <highcharts :options="columnOptions" ref="highchartsColumn"></highcharts>
              </TabPane>
              <TabPane label="折线图" name="spline">
                <highcharts :options="splineOptions" ref="highchartsSpline"></highcharts>
              </TabPane>
              <TabPane label="雷达图" name="spider">
                <highcharts :options="spiderOptions" ref="highchartsSpider"></highcharts>
              </TabPane>
            </Tabs>
          </Row>
            <header class="result-header"></header>
            <div class="tail-wrapper">
              <Button class="tail-button" size="large" @click="exportXlsx">导出Excel</Button>
              <router-link to="/mainpage">
                <Button class="tail-button" size="large" @click="refreshPage">返回问卷</Button>
              </router-link>
            </div>
          <Row>
          </Row>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>
import xlsx from 'better-xlsx'
import fs from 'fs'
import TopMenu from './TopMenu'
import QuestionView from '../assets/QuestionDataView'
import DefaultColumnOptions from '../assets/HighChartsOptions/HighChartsColumn'
import DefaultSplineOptions from '../assets/HighChartsOptions/HighChartsSpline'
import DefaultSpiderOptions from '../assets/HighChartsOptions/HighChartsSpider'

export default {
  name: 'diagram',
  components: {
    TopMenu
  },
  data () {
    let columnOptions = DefaultColumnOptions.options
    let splineOptions = DefaultSplineOptions.options
    let spiderOptions = DefaultSpiderOptions.options
    let scoreData = this.$store.state.Score.scoreArray
    let aspectArray = QuestionView.aspectArray
    let weights = this.$store.state.Score.weights

    var rootScore = new Array(5)
    var rootLevel = new Array(5)
    let defaultCategories = []
    var totalScore = 0
    var totalLevel = ''
    for (var i = 0; i < QuestionView.questionIdMap.length - 1; i++) {
      var tmpScore = 0
      for (var j = QuestionView.questionIdMap[i]; j < QuestionView.questionIdMap[i + 1]; j++) {
        tmpScore += scoreData[j]
      }
      rootScore[i] = tmpScore / QuestionView.questionNumMap[i]
      aspectArray[i].level = this.calcEvaluateLevel(rootScore[i])
      rootLevel[i] = {
        name: aspectArray[i].name,
        level: aspectArray[i].level
      }
      defaultCategories.push(aspectArray[i].name)
      totalScore += rootScore[i] * weights[i] / 100
    }

    totalLevel = this.calcEvaluateLevel(totalScore)
    console.log(rootLevel)
    var seriesData = [{
      name: '城镇',
      data: rootScore
    }]

    columnOptions.series = splineOptions.series = spiderOptions.series = seriesData
    return {
      columnOptions: columnOptions,
      splineOptions: splineOptions,
      spiderOptions: spiderOptions,
      totalScore: totalScore,
      totalLevel: totalLevel,
      rootScore: rootScore,
      rootLevel: rootLevel,
      diagramType: 'column', // column spline spider
      aspectArray: QuestionView.aspectArray,
      currLevel: rootLevel,
      currScore: rootScore,
      currSelect: 'total', // total, 0, 1, 2, 3, 4
      aspectMap: QuestionView.aspectMap
    }
  },
  methods: {
    calcEvaluateLevel: function (score) {
      let ret = ''
      if (score < 20) {
        ret = QuestionView.evaluateLevel[0]
      } else if (score < 40) {
        ret = QuestionView.evaluateLevel[1]
      } else if (score < 60) {
        ret = QuestionView.evaluateLevel[2]
      } else if (score < 80) {
        ret = QuestionView.evaluateLevel[3]
      } else {
        ret = QuestionView.evaluateLevel[4]
      }
      return ret
    },
    switchAspect: function (name) {
      this.currSelect = name
      let aspectIndex = this.getAspectIndex(name)
      let aspectStat = this.genAspectArray(aspectIndex)
      this.currLevel = aspectStat.level
      this.currScore = aspectStat.score
      this.refreshDiagram()
    },
    getAspectIndex: function (name) {
      if (name === 'total') return -1
      else return parseInt(name)
    },
    genAspectArray: function (aspect) {
      let aspectLevel = []
      let aspectScore = []
      if (aspect === -1) {
        aspectLevel = this.rootLevel
        aspectScore = this.rootScore
      } else {
        let aspectInfo = this.aspectArray[aspect]

        let scoreData = this.$store.state.Score.scoreArray
        // calculate subaspect rating
        for (let item of aspectInfo.childNode) {
          let score = 0
          let questionNum = 0
          for (var i = item.questionRange.start - 1; i <= item.questionRange.end - 1; i++) {
            score += scoreData[i]
            questionNum += 1
          }
          let averageScore = score / questionNum
          let averageLevel = this.calcEvaluateLevel(averageScore)
          aspectScore.push(averageScore)
          aspectLevel.push({
            name: item.name,
            level: averageLevel
          })
        }
      }
      return {
        score: aspectScore,
        level: aspectLevel
      }
    },
    refreshDiagram: function () {
      let diagramData = {
        name: '城镇',
        data: this.currScore
      }
      let columnChart = this.$refs.highchartsColumn.chart
      let splineChart = this.$refs.highchartsSpline.chart
      let spiderChart = this.$refs.highchartsSpider.chart
      let xAxisCategoris = []
      for (let item of this.currLevel) {
        xAxisCategoris.push(item.name)
      }
      columnChart.xAxis[0].setCategories(xAxisCategoris)
      splineChart.xAxis[0].setCategories(xAxisCategoris)
      spiderChart.xAxis[0].setCategories(xAxisCategoris)
      columnChart.series[0].update(diagramData)
      splineChart.series[0].update(diagramData)
      spiderChart.series[0].update(diagramData)
    },
    exportXlsx: function () {
      const file = new xlsx.File()

      const style = new xlsx.Style()

      style.align.h = 'center'
      style.align.v = 'center'

      // total stat
      const tsheet = file.addSheet('城镇风貌综合评估结果')
      const header = tsheet.addRow()

      console.log(this.rootLevel.length)
      const score = tsheet.addRow()

      for (let i = 0; i < this.rootLevel.length; i++) {
        const hc = header.addCell()
        const sc = score.addCell()

        hc.value = this.rootLevel[i].name
        sc.value = this.rootScore[i]

        hc.style.align.v = 'center'
        hc.style.align.h = sc.style.align.h = 'center'
      }

      for (let index in this.rootLevel) {
        const sheet = file.addSheet(this.rootLevel[index].name)
        let aspectInfo = this.genAspectArray(index)

        const header = sheet.addRow()
        const score = sheet.addRow()

        for (let j in aspectInfo.level) {
          const hc = header.addCell()
          const sc = score.addCell()

          hc.value = aspectInfo.level[j].name
          sc.value = aspectInfo.score[j]

          hc.style.align.v = 'center'
          hc.style.align.h = sc.style.align.h = 'center'
        }
      }

      file
        .saveAs()
        .pipe(fs.createWriteStream('exporting.xlsx'))
        .on('finish', () => {
          this.$Message.success('导出Excel成功,保存目录为当前目录')
        })
    },
    refreshPage: function () {
      this.$store.commit({
        type: 'SET_PAGE',
        pageId: 1
      })
    }
  }
}
</script>

<style scoped>
.layout{
  border: 1px solid #d7dde4;
  background: #f5f7f9;
}

.layout-content {
  min-height: 200px;
  margin: 15px;
  overflow: hidden;
  background: #fff;
  border-radius: 4px;
}

.result-intro {
  border: 1px solid #eee;
  border-radius: 6px;
  position: relative;
  transition: all .2s ease-in-out;
  padding: 0 12px 12px 12px
}

.result-intro:hover {
  box-shadow: 0 2px 7px rgba(0,0,0,.15);
  border-color: transparent;
  position: relative;
}

.result-header {
  margin: 30px 10px 10px 10px;
  padding: 4px 0 10px;
  border-bottom: 1px solid #eee;
  text-align: center;
}

.detail-intro {
  padding: 10px 0 4px 0
}

.result-content:after {
  content: "";
  display: block;
  width: 1px;
  background: #d7dde4;
  position: absolute;
  top: 0;
  bottom: 0;
  left: -1px;
}

.result-content span {
  display: inline-block;
  background: #fff;
  padding: 0 12px 0 12px;
  position: relative;
  margin-left: 30px;
  font-size: 14px;
}

span button {
  margin-left: 12px;
  height: 75%;
  padding: 2px 12px;
}

.fix {
  position: absolute;
  right: 10%;
  top: -3px;
  padding: 2px 12px 2px 12px 
}

.diagram {
  padding: 30px 0 20px 0
}

.tail-wrapper {
  padding: 10px 20px 10px 20px;
  text-align: center;
}

.tail-button {
  margin: 0 8px 0 8px;
}
</style>

