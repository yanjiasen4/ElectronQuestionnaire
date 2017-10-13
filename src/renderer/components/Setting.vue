<template>
<div class="layout">
  <top-menu v-bind:page="'setting'"></top-menu>
  <Row class="setting-content">
    <div class="slider-wrapper">
      整体风貌
      <Slider v-model="weight0" show-input :tip-format="format"></Slider>
    </div>
    <div class="slider-wrapper">
      建筑风貌
      <Slider v-model="weight1" show-input :tip-format="format"></Slider>
    </div>
    <div class="slider-wrapper">
      道路风貌
      <Slider v-model="weight2" show-input :tip-format="format"></Slider>
    </div>
    <div class="slider-wrapper">
      开放空间
      <Slider v-model="weight3" show-input :tip-format="format"></Slider>
    </div>
    <div class="slider-wrapper">
      地域文化景观
      <Slider v-model="weight4" show-input :tip-format="format"></Slider>
    </div>
      <Button @click="submitSetting">确认设置</Button>
  </Row>
</div>
</template>

<script>
import TopMenu from './TopMenu'

export default {
  data () {
    let weights = this.$store.state.Score.weights
    return {
      weight0: weights[0],
      weight1: weights[1],
      weight2: weights[2],
      weight3: weights[3],
      weight4: weights[4]
    }
  },
  components: { TopMenu },
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
  padding: 8px 0 8px 0;
  position: relative;
}

.setting-content {
  text-align: center;
  padding: 40px 20% 40px 20%
}

</style>
