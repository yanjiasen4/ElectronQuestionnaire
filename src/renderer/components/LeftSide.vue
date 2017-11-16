<template>
  <div class="left-side">
    <item :model="model" :height="rootHeight" :index="model.id" v-for="model in treeData" :key="model.id">
    </item>
  </div>
</template>

<script>
import Item from './TreeToggle/TreeToggle'
import Data from '../assets/QuestionData'

export default {
  name: 'LeftSide',
  data () {
    return {
      treeData: Data.questionStrc,
      rootHeight: 0
    }
  },
  components: {
    Item
  }
}
</script>

<style scoped>
.left-side {
  margin-right: 10px;
  padding-right: 10px;
  border-right: 1px  solid #eee;
  min-height: 720px;
}
</style>

