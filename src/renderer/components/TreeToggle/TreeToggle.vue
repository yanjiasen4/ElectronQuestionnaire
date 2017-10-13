<template>
    <li class="select">
        <button @click='toggle' class="list padding-left" :class="openLeaf">
            <Icon v-if='isFolder && open' type="android-folder-open" size="15"></Icon>
            <Icon v-else-if='isFolder && !open' type="android-folder" size="15"></Icon>
            <!--isFolder判断是否存在子级改变图标-->
            <Icon v-if='!isFolder' type="document-text" size="15px"></Icon> {{model.data.menuName}}
        </button>
        <ul v-show="open" v-if='isFolder' class="padding-left">
            <items v-for='cel in model.childTreeNode' :model='cel' :key="cel.id" :index="cel.id"></items>
        </ul>
    </li>
</template>

<script type="text/javascript">
import questionData from '../../assets/QuestionDataView'

export default {
  name: 'items',
  props: ['model', 'index'],
  data () {
    return {
      opened: false
    }
  },
  components: {},
  computed: {
    isFolder: function () {
      return this.model.childTreeNode && this.model.childTreeNode.length
    },
    activePageId: function () {
      return this.$store.state.CurrPage.currPage
    },
    activeRootId: function () {
      let quesMap = questionData.questionIdMap
      for (let i = 0; i < quesMap.length; i++) {
        if (this.activePageId <= quesMap[i]) return i
      }
      return -1
    },
    activeGraId: function () {
      let quesDetailMap = questionData.questionIdDetailMap
      for (let i = 0; i < quesDetailMap.length; i++) {
        if (this.activePageId <= quesDetailMap[i]) return i
      }
      return -1
    },
    isRoot: function () {
      return this.index >= 10000
    },
    isGra: function () {
      return this.index < 10000 && this.index >= 100
    },
    focus: function () {
      return this.activePageId === this.index
    },
    open: function () {
      if (this.isRoot) {
        return (this.index / 10000 === this.activeRootId) || this.opened
      }
      if (this.isGra) {
        return (this.index / 100 === this.activeGraId) || this.opened
      }
      if (!this.isFolder) {
        return this.focus
      }
    },
    openLeaf: function () {
      return {
        opened: !this.isFolder && this.focus
      }
    }
  },
  methods: {
    toggle: function () {
      if (this.isFolder) {
        this.opened = !this.opened
      } else {
        this.$store.commit({
          type: 'SET_PAGE',
          pageId: this.model.id
        })
      }
    }
  }
}
</script>

<style scoped>

.select {
  list-style: none;
}

.list {
  border-style: none;
}

.list:hover {
  background: #f3f3f3
}

.opened {
  outline: 2px solid #eee;
}

.padding-left {
  padding-left: 6px;
}

.list {
  display: block;
  width: 100%;
  height: 100%;
  padding: 4px 4px 4px 6px;
  text-align: left;
  background-color: white;
  font-size: 14px;
  color: rgb(73, 80, 96);
}

.list:focus {
  outline: 2px solid #eee;
}
</style>
