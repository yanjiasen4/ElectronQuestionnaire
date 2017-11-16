<template>
  <div class="page">
    <div class="header">
      <h1>{{ questionLayer[0] }}</h1>
    <div v-if="remark" class="remark">
        {{ remark }}
      </div>
    </div>
    <question
      v-for="ques in questionList.questions"
      v-bind:question="ques"
      v-bind:key="ques.id">
    </question>
  </div>
</template>

<script>
  import Question from './Question'

  export default {
    name: 'page',
    components: { Question },
    props: ['questionList', 'questionLayer', 'remark']
  }
</script>

<style scoped>
.page {
  border: 1px solid #eee;
  border-radius: 6px;
  margin-bottom: 20px;
  position: relative;
  transition: all .2s ease-in-out;
  padding: 0 12px 20px 12px;
  height: 500px;
}

.page:hover {
  box-shadow: 0 2px 7px rgba(0,0,0,.15);
  border-color: transparent;
  position: relative;
}

.header {
  padding: 16px 20px 16px 20px;
  border-bottom: 1px solid #eee;
}

.remark {
  padding: 12px 20px 12px 20px;
}

</style>
