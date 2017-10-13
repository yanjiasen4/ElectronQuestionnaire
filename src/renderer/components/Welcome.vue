<template>
  <div class="welcom" :class="{ active: isActive }">
    <p>{{ welcome }}</p>
    <div class="button-wrapper">
      <Button size="large" @click="enterMain">进入问卷</Button>
    </div>
  </div>
</template>

<script>
import WelcomeData from '../assets/WelcomeData'

export default {
  name: 'welcome',
  props: ['isActive'],
  data () {
    return {
      welcome: WelcomeData.welcome
    }
  },
  methods: {
    enterMain: function () {
      this.isActive = true
    }
  }
}
</script>

<style scoped>
.welcom {
  padding: 40px 20% 20px 20%;
  text-align: left;
  min-height: 800px;
  text-indent: 40px
}

.active {
  display: none;
}

p {
  font-size: 20px;
}

</style>
