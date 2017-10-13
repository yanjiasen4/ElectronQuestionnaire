var initScore = new Array(71)
for (var i = 0; i < initScore.length; i++) {
  initScore[i] = 0
}

const state = {
  allPageSelected: false,
  scoreArray: initScore,
  weights: [20, 20, 20, 20, 20]
}

const mutations = {
  SET_SCORE (state, payload) {
    state.scoreArray = payload.scoreData
  },
  SET_SELECTED (state, payload) {
    state.allPageSelected = payload.res
  },
  SET_WEIGHTS (state, payload) {
    state.weights = payload.weights
  }
}

export default {
  state,
  mutations
}
