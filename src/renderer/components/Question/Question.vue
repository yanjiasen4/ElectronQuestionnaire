<template>
  <div class="question">
    <p>{{ question.id }}. {{ question.content }}</p>
    <RadioGroup class="select-group" v-model='question.answer' size='large'>
      <Radio label='90'>{{ question.select[0] }}</Radio>
      <Radio label='70'>{{ question.select[1] }}</Radio>
      <Radio label='50'>{{ question.select[2] }}</Radio>
      <Radio label='30'>{{ question.select[3] }}</Radio>
      <Radio label='10'>{{ question.select[4] }}</Radio>
    </RadioGroup>
  </div>
</template>

<script>
  export default {
    name: 'question',
    props: ['question']
  }
</script>

<style scoped>
.question {
  padding: 5px 10px 10px 10px;
  border-bottom: 1px solid #eee;
}
p {
  font-size: 16px;
  padding: 8px 5px 12px 5px
}
.select-group {
  padding-left: 12px;
}

.select-group label span {
  font-size: 16px
}
</style>