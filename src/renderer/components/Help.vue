<template>
<div class="layout">
  <top-menu v-bind:page="'help'"></top-menu>
  <Row class="help-content">
      
  </Row>
</div>
</template>

<script>
import TopMenu from './TopMenu'

export default {
  components: { TopMenu }
}
</script>

<style scoped>

.help-content {
    text-align: center;
}

</style>