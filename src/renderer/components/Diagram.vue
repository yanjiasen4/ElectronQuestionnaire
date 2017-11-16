<template>
  <div class="layout">
    <top-menu v-bind:page="'diagram'"></top-menu>
    <div class="layout-content">
      <Row class="result-intro">
        <Col span="5" class="bottom">
          <Menu active-name="total" width="auto" @on-select="switchAspect">
            <MenuItem name="total" class="left-nav">
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
              <Button class="tail-button" size="large" @click="inputName = true">导出Excel</Button>
              <Modal
                v-model="inputName"
                title="导出Excel文件名设置"
                @on-ok="exportXlsx(exportName)">
                <Input v-model="exportName" placeholder="请输入保存文件名"></Input>
              </Modal>
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
import XLSX from 'xlsx'
import fs from 'fs'
import path from 'path'
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
    const dirPath = path.resolve('exporting')
    let columnOptions = DefaultColumnOptions.options
    let splineOptions = DefaultSplineOptions.options
    let spiderOptions = DefaultSpiderOptions.options
    let scoreData = this.$store.state.Score.scoreArray
    let aspectArray = QuestionView.aspectArray
    let weights = this.$store.state.Score.weights

    let rootScore = new Array(5)
    let rootLevel = new Array(5)
    let defaultCategories = []
    let totalScore = 0
    let totalLevel = ''
    for (let i = 0; i < QuestionView.questionIdMap.length - 1; i++) {
      let tmpScore = 0
      let answerdQuestionNum = 0
      for (let j = QuestionView.questionIdMap[i]; j < QuestionView.questionIdMap[i + 1]; j++) {
        if (scoreData[j] !== 0) {
          answerdQuestionNum += 1
          tmpScore += scoreData[j]
        } else {
          tmpScore += 0
        }
      }
      rootScore[i] = tmpScore / (answerdQuestionNum !== 0 ? answerdQuestionNum : 1)
      aspectArray[i].level = this.calcEvaluateLevel(rootScore[i])
      rootLevel[i] = {
        name: aspectArray[i].name,
        level: aspectArray[i].level
      }
      defaultCategories.push(aspectArray[i].name)
      console.log(weights[i])
      totalScore += rootScore[i] * weights[i] / 100
    }

    totalLevel = this.calcEvaluateLevel(totalScore)

    let diagramRootLevel = rootLevel.concat()
    let diagramRootScore = rootScore.concat()
    diagramRootLevel.push({
      name: '城镇风貌综合评分',
      level: totalLevel
    })
    diagramRootScore.push(totalScore)

    let seriesData = [{
      name: '城镇',
      data: diagramRootScore
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
      diagramRootLevel: diagramRootLevel,
      diagramRootScore: diagramRootScore,
      diagramType: 'column', // column spline spider
      aspectArray: QuestionView.aspectArray,
      currLevel: rootLevel,
      currScore: rootScore,
      currSelect: 'total', // total, 0, 1, 2, 3, 4
      aspectMap: QuestionView.aspectMap,
      inputName: false,
      exportName: '',
      exportDir: dirPath + '/',
      exportStatPath: dirPath + '/data.xlsx'
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
    refreshScore: function () {
      let columnOptions = DefaultColumnOptions.options
      let splineOptions = DefaultSplineOptions.options
      let spiderOptions = DefaultSpiderOptions.options
      let scoreData = this.$store.state.Score.scoreArray
      let aspectArray = QuestionView.aspectArray
      let weights = this.$store.state.Score.weights

      let rootScore = new Array(5)
      let rootLevel = new Array(5)
      let defaultCategories = []
      let totalScore = 0
      let totalLevel = ''
      for (let i = 0; i < QuestionView.questionIdMap.length - 1; i++) {
        let tmpScore = 0
        let answerdQuestionNum = 0
        for (let j = QuestionView.questionIdMap[i]; j < QuestionView.questionIdMap[i + 1]; j++) {
          if (scoreData[j] !== 0) {
            answerdQuestionNum += 1
            tmpScore += scoreData[j]
          } else {
            tmpScore += 0
          }
        }
        rootScore[i] = tmpScore / (answerdQuestionNum !== 0 ? answerdQuestionNum : 1)
        aspectArray[i].level = this.calcEvaluateLevel(rootScore[i])
        rootLevel[i] = {
          name: aspectArray[i].name,
          level: aspectArray[i].level
        }
        defaultCategories.push(aspectArray[i].name)
        totalScore += rootScore[i] * weights[i] / 100
      }

      totalLevel = this.calcEvaluateLevel(totalScore)

      let diagramRootLevel = rootLevel.concat()
      let diagramRootScore = rootScore.concat()
      diagramRootLevel.push({
        name: '城镇风貌综合评分',
        level: totalLevel
      })
      diagramRootScore.push(totalScore)

      let seriesData = [{
        name: '城镇',
        data: diagramRootScore
      }]

      columnOptions.series = splineOptions.series = spiderOptions.series = seriesData

      this.totalScore = totalScore
      this.totalLevel = totalLevel
      this.rootScore = rootScore
      this.rootLevel = rootLevel
      this.diagramRootLevel = diagramRootLevel
      this.diagramRootScore = diagramRootScore
      this.currLevel = rootLevel
      this.currScore = rootScore
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
        aspectLevel = this.diagramRootLevel
        aspectScore = this.diagramRootScore
      } else {
        let aspectInfo = this.aspectArray[aspect]

        let scoreData = this.$store.state.Score.scoreArray
        // calculate subaspect rating
        for (let item of aspectInfo.childNode) {
          let score = 0
          let questionNum = 0
          for (let i = item.questionRange.start - 1; i <= item.questionRange.end - 1; i++) {
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
    exportXlsx: function (filename) {
      this.checkXLSXDir()

      const wb = XLSX.utils.book_new()

      let arrayHeader = []

      for (let i in this.diagramRootLevel) {
        arrayHeader.push(this.diagramRootLevel[i].name)
      }

      const ws = XLSX.utils.aoa_to_sheet([arrayHeader, this.diagramRootScore])
      XLSX.utils.book_append_sheet(wb, ws, '城镇风貌综合评估结果')

      for (let index in this.rootLevel) {
        let aspectInfo = this.genAspectArray(index)

        let subArrayHeader = []
        let subArrayContent = []

        for (let j in aspectInfo.level) {
          subArrayHeader.push(aspectInfo.level[j].name)
        }
        subArrayContent = aspectInfo.score

        const ws = XLSX.utils.aoa_to_sheet([subArrayHeader, subArrayContent])
        XLSX.utils.book_append_sheet(wb, ws, this.rootLevel[index].name)
      }

      XLSX.writeFile(wb, this.exportDir + this.exportName + '.xlsx')

      let dataExists = true
      try {
        fs.accessSync(this.exportStatPath)
      } catch (e) {
        dataExists = false
      }

      if (!dataExists) {
        // throw new Error('ERROR: failed to open file: data.xlsx')
        const dwb = XLSX.utils.book_new()

        let darrayHeader = ['项']

        for (let i in this.diagramRootLevel) {
          darrayHeader.push(this.diagramRootLevel[i].name)
        }

        let darrayContent1 = ['总值']
        let darrayContent2 = ['平均值']
        for (let i in this.diagramRootScore) {
          darrayContent1.push(this.diagramRootScore[i])
          darrayContent2.push(this.diagramRootScore[i])
        }
        const dws = XLSX.utils.aoa_to_sheet([darrayHeader, darrayContent1, darrayContent2])
        XLSX.utils.book_append_sheet(dwb, dws, '城镇风貌综合评估结果')

        for (let index in this.rootLevel) {
          let aspectInfo = this.genAspectArray(index)

          let dsubArrayHeader = ['项']
          let dsubArrayContent1 = ['总值']
          let dsubArrayContent2 = ['平均值']

          for (let j in aspectInfo.level) {
            dsubArrayHeader.push(aspectInfo.level[j].name)
            dsubArrayContent1.push(aspectInfo.score[j])
            dsubArrayContent2.push(aspectInfo.score[j])
          }
          const dws = XLSX.utils.aoa_to_sheet([dsubArrayHeader, dsubArrayContent1, dsubArrayContent2])
          XLSX.utils.book_append_sheet(dwb, dws, this.rootLevel[index].name)
        }
        XLSX.writeFile(dwb, this.exportStatPath)
      } else {
        this.updateDataXLSX()
      }
    },
    updateDataXLSX: function () {
      // this.readDataXLSX()
      let workbook = XLSX.readFile(this.exportStatPath)
      let sheetNames = workbook.SheetNames
      const nws = XLSX.utils.book_new()
      let subAspectIndex = 0

      for (let sheet of sheetNames) {
        let ws = workbook.Sheets[sheet]
        let jsonResult = XLSX.utils.sheet_to_json(ws, {header: 1, raw: true})
        let statCount = this.calcDataCount(jsonResult)
        let result = [jsonResult[0], ['总值'], ['平均值']]

        if (sheet === '城镇风貌综合评估结果') {
          for (let j = 1; j < jsonResult[0].length; j++) {
            jsonResult[1][j] += this.diagramRootScore[j - 1]
            jsonResult[2][j] = jsonResult[1][j] / statCount

            result[1].push(jsonResult[1][j])
            result[2].push(jsonResult[1][j] / (statCount + 1))
          }
          let dws = XLSX.utils.aoa_to_sheet(result)

          XLSX.utils.book_append_sheet(nws, dws, '城镇风貌综合评估结果')
        } else {
          let aspectInfo = this.genAspectArray(subAspectIndex)
          for (let j = 1; j < jsonResult[0].length; j++) {
            jsonResult[1][j] += aspectInfo.score[j - 1]
            jsonResult[2][j] = jsonResult[1][j] / statCount

            result[1].push(jsonResult[1][j])
            result[2].push(jsonResult[1][j] / (statCount + 1))
          }
          let dws = XLSX.utils.aoa_to_sheet(result)

          XLSX.utils.book_append_sheet(nws, dws, this.rootLevel[subAspectIndex].name)
          subAspectIndex += 1
        }
      }
      XLSX.writeFile(nws, this.exportStatPath)
    },
    calcDataCount: function (data) {
      for (let i = 1; i < data[1].length; i++) {
        if (data[2][i] === 0) continue
        else {
          return Math.round(data[1][i] / data[2][i])
        }
      }
      return 1
    },
    refreshPage: function () {
      this.$store.commit({
        type: 'SET_PAGE',
        pageId: 1
      })
    },
    checkXLSXDir: function () {
      const dirPath = path.resolve('exporting')
      if (!fs.existsSync(dirPath)) {
        fs.mkdir(dirPath, function (err) {
          if (err) {
            this.$Message.error('创建文件夹时发生错误:' + err)
          }
        })
      }
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

.bottom {
  z-index: 0;
}

.left-nav {
  z-index: 0.2;
}

.layout-text {
  z-index: 0.2;
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

