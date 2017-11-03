<template>
  <Menu ref="headMenu" mode="horizontal" theme="dark" :active-name="currPage" @on-select="enterDiagram">
    <div class="layout-nav">
      <router-link to="/setting">
        <MenuItem name="setting">
        <Icon type="ios-navigate"></Icon>
        参数设置
        </MenuItem>
      </router-link>
      <router-link to="/mainpage">
        <MenuItem name="questionnaire">
        <Icon type="ios-navigate"></Icon>
        评价系统
        </MenuItem>
      </router-link>
      <router-link :to="isAllPageSelected ? '/diagram' : '#'">
        <MenuItem name="diagram">
          <Icon type="ios-keypad"></Icon>
          结果展示
        </MenuItem>
      </router-link>
      <router-link to="/help">
        <MenuItem name="help">
          <Icon type="ios-keypad"></Icon>
          帮助
        </MenuItem>
      </router-link>
    </div>
    <!-- <div class="layout-close">
      <Button type="text" class="button-close" v-on:click="closeWindow()">
        <Icon type="close" color="white"></Icon>
      </Button>
    </div> -->
  </Menu>
</template>

<script>
export default {
  name: 'topMenu',
  props: ['page'],
  methods: {
    closeWindow: function () {
      window.close()
    },
    enterDiagram: function (name) {
      if (name === 'diagram') {
        if (!this.isAllPageSelected) {
          this.$Message.error('有问题未回答，请全部完成后再进入结果展示')
          this.$refs.headMenu.currentActiveName = this.page
        }
      }
    }
  },
  computed: {
    isAllPageSelected: function () {
      return this.$store.state.Score.allPageSelected
    },
    currPage: function () {
      return this.page
    }
  }
}
</script>

<style scoped>
  .layout-nav{
    width: 480px;
    margin: 0 auto;
  }
  .layout-close{
    float: right;
    position: relative;
    top: 0px;
    right: 20px;
  }
  .button-close {
    width: 40px;
  }
</style>
