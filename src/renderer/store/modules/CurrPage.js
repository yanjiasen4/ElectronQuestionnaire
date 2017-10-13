const state = {
  active: false,
  currPage: 1
}

const mutations = {
  DECREMENT_PAGE (state) {
    state.currPage--
  },
  INCREMENT_PAGE (state) {
    state.currPage++
  },
  SET_PAGE (state, payload) {
    state.currPage = payload.pageId
  },
  SET_ACTIVE (state) {
    state.active = !state.active
  }
}

const actions = {
  someAsyncTask ({ commit }) {
    // do something async
    commit('INCREMENT_PAGE')
  }
}

export default {
  state,
  mutations,
  actions
}
