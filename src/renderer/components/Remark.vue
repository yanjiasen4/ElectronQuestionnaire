<template>
  <div class="remark">
    <header class="remark-header">备注</header>
    <p>{{ remark }}</p>
  </div>
</template>
<script>
export default {
  name: 'Remark',
  props: ['remark']
}
</script>
<style scoped>
.remark-header {
  padding: 12px 0 12px 0;
  border-bottom: 1px solid #eee;
}
.remark {
  padding: 0;
  margin: 0 0 0 20px;
  border: 1px solid #eee;
  border-radius: 6px;
  height: auto;
  min-height: 400px;
}
.remark:hover {
  box-shadow: 0 2px 7px rgba(0,0,0,.15);
  border-color: transparent;
  position: relative;
}
</style>
