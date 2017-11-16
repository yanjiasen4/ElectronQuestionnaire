<template>
<div class="layout">
  <top-menu v-bind:page="'help'"></top-menu>
  <Row class="help-content">
    <div v-for="(msg, index) in message" v-bind:key="msg" class="help-list">
      <p>({{ index }}) {{ msg }}</p>
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
      message: [Message.Help, Message.settingHelp, Message.exportHelp, Message.importHelp]
    }
  }
}
</script>

<style scoped>

.help-content {
    text-align: center;
}

.help-list {
  padding: 20px 20% 10px 20%;
  text-align: left;
  min-height: 80px;
  text-indent: 40px
}

.help-list p {
  font-size: 20px;
}
</style>