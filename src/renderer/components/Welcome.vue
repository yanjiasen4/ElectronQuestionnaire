<template>
  <div class="welcome">
    <div class="layout-content">
      <div class="plain-text">
        <header>
          <p>{{ welcomeTitle }}</p>
        </header>
        <p>{{ welcomeContent }}
        </p>
      </div>
      <div class="button-wrapper">
        <Button size="large" @click="enterMain">进入评价系统</Button>
      </div>
    </div>
    <div class="layout-copy">
      <Row class="copy-line">
        开发机构：上海交通大学城镇空间文化与科学研究中心
      </Row>
      <Row class="copy-line">
        地&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;址：上海市闵行区东川路800号木兰楼
      </Row>
      <Row class="copy-line">
        联系我们：uspace@sjtu.edu.cn
      </Row>
      </div>
    </div>
  </div>
</template>

<script>
import WelcomeData from '../assets/WelcomeData'

export default {
  name: 'welcome',
  data () {
    return {
      welcomeTitle: WelcomeData.welcomeTitle,
      welcomeContent: WelcomeData.welcomeContent
    }
  },
  methods: {
    enterMain: function () {
      this.$router.push('mainPage')
    }
  }
}
</script>

<style scoped>
.layout-content {
  height: 600px;
}

.welcome {
  padding: 40px 20% 20px 20%;
  min-height: 800px;
  text-indent: 40px
}

.plain-text header{
  text-align: center;
  padding-bottom: 20px;
}

p {
  font-size: 20px;
}

.button-wrapper {
  padding: 20px 0 0 0;  
  text-align: center;
}

.layout-copy{
  position: relative;
  top: 150px;
  min-width: 250px;
  text-align: center;
  padding: 10px 0 20px 0;
  color: #9ea7b4;
}

.copy-line {
  padding: 0 0 0 31%;
  text-align: left;
}

.layout-copy p {
  text-align: left;
  font-size: 12px;
}
</style>
