<template>
<div class="layout">
  <top-menu v-bind:page="'help'"></top-menu>
  <Row class="help-content">
    <div class="help-list">
      <p>{{ welcome }}</p>
    </div>
    <div class="help-list">
      <p>{{ settingHelp }}</p>
    </div>
    <div class="help-list">
      <p>{{ exportHelp }}</p>
    </div>
  </Row>
</div>
</template>

<script>
import Message from '../assets/WelcomeData'
import TopMenu from './TopMenu'

export default {
  components: { TopMenu },
  data () {
    return {
      welcome: Message.welcome,
      settingHelp: Message.settingHelp,
      exportHelp: Message.exportHelp
    }
  }
}
</script>

<style scoped>

.help-content {
    text-align: center;
}

.help-list {
  padding: 40px 20% 20px 20%;
  text-align: left;
  min-height: 160px;
  text-indent: 40px
}

.help-list p {
  font-size: 20px;
}
</style>