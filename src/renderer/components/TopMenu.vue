<template>
  <Menu ref="headMenu" class="layout-nav" mode="horizontal" theme="dark" :active-name="currPage" @on-select="enterDiagram">

      <Submenu  name="file"> 
        <template slot="title">
          <Icon type="ios-paper"></Icon>
          文件
        </template>
        <MenuItem name="file-import">导入xlsx</MenuItem>
      </Submenu>

      <Submenu  name="setting"> 
        <template slot="title">
          <Icon type="settings"></Icon>
          参数设置
        </template>
        <router-link to="/setting-parm">
          <MenuItem name="setting-parm">
          权重设置
          </MenuItem>
        </router-link>
        <MenuItem name="setting-others">
          其他
        </MenuItem>
      </Submenu>

      <router-link to="/mainpage">
        <MenuItem name="questionnaire">
        <Icon type="ios-list-outline"></Icon>
        评价系统
        </MenuItem>
      </router-link>
      
      <Submenu name="result">
        <template slot="title">
          <Icon type="stats-bars"></Icon>
          结果展示
        </template>
        <router-link :to="isAllPageSelected ? '/diagram' : '#'">
          <MenuItem name="diagram">
            结果展示
          </MenuItem>
        </router-link>
        <MenuItem name="file-stat">
          综合统计结果
        </MenuItem>
      </Submenu>

      <router-link to="/help">
        <MenuItem name="help">
          <Icon type="help"></Icon>
          帮助
        </MenuItem>
      </router-link>

    <!-- <div class="layout-close">
      <Button type="text" class="button-close" v-on:click="closeWindow()">
        <Icon type="close" color="white"></Icon>
      </Button>
    </div> -->
  </Menu>
</template>

<script>
import XLSX from 'xlsx'
import fs from 'fs'
import path from 'path'
import questionView from '../assets/QuestionDataView'
const {dialog} = require('electron').remote

export default {
  name: 'topMenu',
  props: ['page'],
  data () {
    return {
      statDataPath: path.resolve('exporting') + '/data.xlsx'
    }
  },
  methods: {
    closeWindow: function () {
      window.close()
    },
    enterDiagram: function (name) {
      if (name === 'diagram') {
        if (!this.isAllPageSelected) {
          this.$Message.error('有问题未回答，请全部完成后再进入结果展示')
          this.$refs.headMenu.currentActiveName = this.page
        }
      } else if (name === 'file-import') {
        let _this = this
        let options = {
          filters: [
            {name: 'Xlsx文件', extensions: ['xlsx']}
          ],
          title: '请选择xlsx文件',
          properties: ['openFile']
        }
        dialog.showOpenDialog(options, function (res) {
          if (res && res.length !== 0) {
            _this.loadXLSX(res[0])
            _this.$Message.success('读取xlsx文件成功')
            _this.$router.push('loading')
          }
        })
      } else if (name === 'file-stat') {
        let ret = this.loadStatXLSX()
        if (ret) {
          this.$Message.success('读取统计xlsx文件成功')
          this.$router.push('loading')
        }
      }
    },
    loadXLSX: function (filename) {
      let workbook = XLSX.readFile(filename)
      let sheetNames = workbook.SheetNames
      let questionIdDetailMap = questionView.questionIdDetailMap
      let pageScore = []
      if (!this.checkXLSX()) {
        return false
      }
      let pageIndex = 0
      for (let i = 1; i < sheetNames.length; i++) {
        let ws = workbook.Sheets[sheetNames[i]]
        let jsonResult = XLSX.utils.sheet_to_json(ws, {header: 1, raw: true})
        for (let j = 0; j < jsonResult[0].length; j++) {
          for (let k = questionIdDetailMap[pageIndex]; k < questionIdDetailMap[pageIndex + 1]; k++) {
            pageScore.push(jsonResult[1][j])
          }
          pageIndex += 1
        }
      }
      this.$store.commit({
        type: 'SET_SCORE',
        scoreData: pageScore
      })
    },
    loadStatXLSX: function () {
      if (!this.checkStatXLSX()) {
        this.$Message.error({
          content: '统计文件读取失败，请检查exporting文件夹下是否有data.xlsx文件',
          duration: 3
        })
        return false
      }
      let workbook = XLSX.readFile(this.statDataPath)
      let sheetNames = workbook.SheetNames
      let questionIdDetailMap = questionView.questionIdDetailMap
      let pageScore = []
      if (!this.checkXLSX()) {
        this.$Message.error('统计文件数据格式错误')
        return false
      }
      let pageIndex = 0
      for (let i = 1; i < sheetNames.length; i++) {
        let ws = workbook.Sheets[sheetNames[i]]
        let jsonResult = XLSX.utils.sheet_to_json(ws, {header: 1, raw: true})
        for (let j = 1; j < jsonResult[0].length; j++) {
          for (let k = questionIdDetailMap[pageIndex]; k < questionIdDetailMap[pageIndex + 1]; k++) {
            pageScore.push(jsonResult[2][j])
          }
          pageIndex += 1
        }
      }
      this.$store.commit({
        type: 'SET_SCORE',
        scoreData: pageScore
      })
      return true
    },
    checkXLSX: function (sheetNames) {
      let expectSeetNames = questionView.questionNameMap
      for (let index in sheetNames) {
        if (sheetNames[index] !== expectSeetNames[index]) {
          this.$Message.error('xlsx文件格式有误')
          return false
        }
      }
      return true
    },
    checkStatXLSX: function () {
      if (fs.existsSync(this.statDataPath)) {
        return true
      } else {
        return false
      }
    }
  },
  computed: {
    isAllPageSelected: function () {
      return this.$store.state.Score.allPageSelected
    },
    currPage: function () {
      return this.page
    }
  }
}
</script>

<style scoped>
  .layout-nav{
    width: 100%;
    margin: 0 auto;
    padding: 0 0 0 10px;
  }
  .layout-close{
    float: right;
    position: relative;
    top: 0px;
    right: 20px;
  }
  .button-close {
    width: 40px;
  }
</style>
