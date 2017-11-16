<template>
<div class="layout">
  <top-menu v-bind:page="'setting-parm'"></top-menu>
  <Row class="setting-content">
    <Col span="20">
      <Row class="slider-wrapper" type="flex" align="middle">
        <Col span="6" class="setting-text">
          <span>指标一 整体风貌 权重值：</span>
        </Col>
        <Col span="17">
          <Slider v-model="weight0" show-input :tip-format="format"></Slider>
        </Col>
        <Col span="1">
          <span class="percent">%</span>
        </Col>
      </Row>
      <Row class="slider-wrapper" type="flex" align="middle">
        <Col span="6" class="setting-text">
          <span>指标二 建筑风貌 权重值：</span>
        </Col>
        <Col span="17">
          <Slider v-model="weight1" show-input :tip-format="format"></Slider>
        </Col>
        <Col span="1">
          <span class="percent">%</span>
        </Col>
      </Row>
      <Row class="slider-wrapper" type="flex" align="middle">
        <Col span="6" class="setting-text">
          <span>指标三 道路风貌 权重值：</span>
        </Col>
        <Col span="17">
          <Slider v-model="weight2" show-input :tip-format="format"></Slider>
        </Col>
        <Col span="1">
          <span class="percent">%</span>
        </Col>
      </Row>
      <Row class="slider-wrapper" type="flex" align="middle">
        <Col span="6" class="setting-text">
          <span>指标四 开放空间 权重值：</span>
        </Col>
        <Col span="17">
          <Slider v-model="weight3" show-input :tip-format="format"></Slider>
        </Col>
        <Col span="1">
          <span class="percent">%</span>
        </Col>
      </Row>
      <Row class="slider-wrapper" type="flex" align="middle">
        <Col span="6" class="setting-text">
          <span>指标五 地域文化景观 权重值：</span>
        </Col>
        <Col span="17">
          <Slider v-model="weight4" show-input :tip-format="format"></Slider>
        </Col>
        <Col span="1">
          <span class="percent">%</span>
        </Col>
      </Row>
      <Button @click="submitSetting">确认设置</Button>
    </Col>
    <Col span="4">
      <Remark v-bind:remark="settingRemark"></Remark>
    </Col>
  </Row>
</div>
</template>

<script>
import TopMenu from './TopMenu'
import Remark from './Remark'
import RemarkText from '../assets/RemarksData'

export default {
  data () {
    let weights = this.$store.state.Score.weights
    return {
      weight0: weights[0],
      weight1: weights[1],
      weight2: weights[2],
      weight3: weights[3],
      weight4: weights[4],
      settingRemark: RemarkText.settingRemark
    }
  },
  components: { TopMenu, Remark },
  methods: {
    submitSetting: function () {
      if (!this.checkSetting) {
        this.$Message.error('权值和不为100%，请重新设置')
      } else {
        let weights = [this.weight0, this.weight1, this.weight2, this.weight3, this.weight4]
        this.$store.commit({
          type: 'SET_WEIGHTS',
          weights: weights
        })
        this.$Message.success('权重设置成功')
        this.$router.push('mainpage')
      }
    },
    sliderMax: function (self) {
      let weights = [this.weight0, this.weight1, this.weight2, this.weight3, this.weight4]
      let selfValue = weights[self]
      return 100 - this.totalWeights + selfValue
    },
    format (val) {
      return '权重' + val + '%'
    }
  },
  computed: {
    totalWeights: function () {
      let totalWeights = 0
      let weights = [this.weight0, this.weight1, this.weight2, this.weight3, this.weight4]
      for (let i in weights) {
        totalWeights += weights[i]
      }
      return totalWeights
    },
    checkSetting: function () {
      return this.totalWeights === 100
    }
  }
}
</script>

<style scoped>

.slider-wrapper {
  padding: 8px 20px 8px 20px;
}

.setting-text {
  padding: 10px 0 10px 20px;
  text-align: left;
}

.percent {
  padding: 
}

.setting-content {
  text-align: center;
  padding: 40px 0 40px 0;
  max-width: 1600px;
}

</style>
