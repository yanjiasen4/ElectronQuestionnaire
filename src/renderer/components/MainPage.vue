<template>
<div class="layout">
  <top-menu v-bind:page="'questionnaire'"></top-menu>
  <div class="welcome" :class="{ hide: activeMain }">
    <div class="welcome-header">
      <p>{{ welcome }}</p>
      <div class="exp-text">
        <p>E<sub>综合</sub>=W<sub>1</sub>&times;E<sub>整体风貌</sub>+W<sub>2</sub>&times;E<sub>建筑风貌</sub>+W<sub>3</sub>&times;E<sub>道路风貌</sub>+W<sub>4</sub>&times;E<sub>开发空间</sub>+W<sub>5</sub>&times;E<sub>文化景观</sub></p>
      </div>
    </div>
    <div class="welcome-button-wrapper">
      <Button size="large" class="button-wrapper" @click="enterMain">开始评价</Button>
    </div>
  </div>
  <div class="layout-content" :class="{ hide: !activeMain }">
    <Row class="result-intro">
      <Col span="5">
        <left-side>
        </left-side>
      </Col>
      <Col span="19">
          <div v-for="quesData in questionData" v-bind:key="quesData.id" :class="activePage(quesData.id)">
            <div class="question-page">
              <page
                v-bind:questionList="quesData.questionList"
                v-bind:questionLayer="[quesData.preRange, quesData.graRange, quesData.rootRange]"
                v-bind:remark="getPageRemark(quesData.id)"
                v-bind:key="quesData.id">
                {{ quesData.id }}
              </page>
            </div>
            <div class="button-page">     
              <div v-if="isLastPage">
                <Button v-if="!isFirstPage" class="button-wrapper" v-on:click="prevPage">上一题</Button>
                <router-link :to="isAllPageSelected ? '/diagram': '/diagram'">
                  <Button type="success" class="button-wrapper" v-on:click="commitAllPage">确认提交</Button>
                </router-link>
              </div>
              <div v-else>
                <Button v-if="!isFirstPage" class="button-wrapper" v-on:click="prevPage">上一题</Button>
                <Button v-if="!isLastPage" class="button-wrapper" v-on:click="nextPage">下一题</Button>
              </div>
            </div>
          </div>
      </Col>
    </Row>
  </div>
</div>
</template>

<script>
  import WelcomeData from '../assets/WelcomeData'
  import Data from '../assets/QuestionData'
  import RemarkData from '../assets/RemarksData'
  import Page from './Question/Page'
  import LeftSide from './LeftSide'
  import TopMenu from './TopMenu'

  let initScore = new Array(Data.maxPage)
  for (let i = 0; i < initScore.length; i++) {
    initScore[i] = 0
  }
  export default {
    name: 'MainPage',
    components: { TopMenu, Page, LeftSide },
    data () {
      return {
        welcome: WelcomeData.welcome,
        questionData: Data.questionData,
        maxPage: Data.maxPage,
        pageScore: initScore,
        remarks: RemarkData.questionRemarks
      }
    },
    methods: {
      enterMain: function () {
        this.$store.commit('SET_ACTIVE')
      },
      activePage: function (pageId) {
        return {
          active: pageId === this.activePageId,
          hide: pageId !== this.activePageId
        }
      },
      nextPage: function () {
        if (this.activePageId < this.maxPage) {
          if (!this.commitPage()) return
          this.$store.commit('INCREMENT_PAGE')
          // this.activePageId = this.$store.state.CurrPage.currPage
        }
      },
      prevPage: function () {
        if (this.activePageId > 1) {
          this.$store.commit('DECREMENT_PAGE')
          // this.activePageId = this.$store.state.CurrPage.currPage
        }
      },
      commitPage: function () {
        if (!this.isAllSelected()) {
          this.$Message.warning('上页有问题尚未回答')
        }
        this.setIsAllPageSelected()
        this.fillinScore()
        return true
      },
      commitAllPage: function () {
        let ret = this.commitPage()
        if (ret && !this.isAllPageSelected) {
          this.$Message.warning('仍有问题尚未回答，统计结果将忽略未回答问题')
        }
      },
      isAllSelected: function () {
        let pageQuestions = this.questionData[this.activePageId - 1].questionList.questions
        let subQuesNum = pageQuestions.length
        for (let i = 0; i < subQuesNum; i++) {
          if (pageQuestions[i].answer === '') {
            return false
          }
        }
        return true
      },
      setIsAllPageSelected: function () {
        let allQuestions = this.questionData
        for (let i = 0; i < allQuestions.length; i++) {
          let pageQuestions = allQuestions[i].questionList.questions
          for (let j = 0; j < pageQuestions.length; j++) {
            if (pageQuestions[j].answer === '') {
              return
            }
          }
        }
        this.$store.commit({
          type: 'SET_SELECTED',
          res: true
        })
      },
      fillinScore: function () {
        let pageQuestions = this.questionData[this.activePageId - 1].questionList.questions
        let subQuesNum = pageQuestions.length
        let answerdQuestionNum = 0
        let currPageScore = 0
        for (let i = 0; i < subQuesNum; i++) {
          if (pageQuestions[i].answer !== '') {
            currPageScore += parseInt(pageQuestions[i].answer)
            answerdQuestionNum += 1
          }
        }
        this.pageScore[this.activePageId - 1] = currPageScore / (answerdQuestionNum !== 0 ? answerdQuestionNum : 1)
        this.$store.commit({
          type: 'SET_SCORE',
          scoreData: this.pageScore
        })
      },
      getPageRemark: function (id) {
        for (let i = 0; i < this.remarks.length; i++) {
          if (parseInt(this.remarks[i].id) === id) {
            return this.remarks[i].remark
          }
        }
        return ''
      }
    },
    computed: {
      activeMain: function () {
        return this.$store.state.CurrPage.active
      },
      activePageId: function () {
        return this.$store.state.CurrPage.currPage
      },
      isAllPageSelected: function () {
        return this.$store.state.Score.allPageSelected
      },
      isFirstPage: function () {
        return parseInt(this.activePageId) === 1
      },
      isLastPage: function () {
        return parseInt(this.activePageId) === this.maxPage
      }
    }
  }
</script>


<style scoped>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }

  /* body { 
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  } */

  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
  }
  .welcome-header {
    padding: 40px 20% 20px 20%;
    text-align: left;
    min-height: 160px;
    text-indent: 40px
  }

  .active {
    display: none;
  }

  .welcome {
    min-height: 800px;
  }

  .welcome-header p {
    font-size: 20px;
  }

  .exp-text {
    text-align: center;
  }

  .welcome-button-wrapper {
    text-align: center;
    padding: 12px 20% 40px 20%;
  }

  .layout-content{
    min-height: 200px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }
  .layout-logo{
    width: 100px;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    float: left;
    position: relative;
    top: 15px;
    left: 20px;
  }
  .result-intro {
    border: 1px solid #eee;
    border-radius: 6px;
    position: relative;
    transition: all .2s ease-in-out;
    padding: 0 12px 12px 12px;
    min-height: 779px;
  }

  .result-intro:hover {
    box-shadow: 0 2px 7px rgba(0,0,0,.15);
    border-color: transparent;
    position: relative;
  }

  .question-page {
    height: 500px;
  }
  .button-page {
    text-align: center;
    padding: 20px 10px 20px 10px
  }
  .button-wrapper {
    width: 96px;
    padding: 5px 12px 5px 12px;
    margin: 0 10px 0 10px
  }
  .active {
    display: inline;
  }

  .hide {
    display: none;
  }
</style>

