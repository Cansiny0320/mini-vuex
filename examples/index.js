import { createStore } from '../src/store.js'

const state = {
  count: 0,
}
const mutations = {
  increment(state) {
    state.count++
  },
  decrement(state) {
    state.count--
  },
}

const actions = {
  increment: ({ commit }) => commit('increment'),
  decrement: ({ commit }) => commit('decrement'),
  incrementIfOdd({ commit, state }) {
    if ((state.count + 1) % 2 === 0) {
      commit('increment')
    }
  },
  incrementAsync({ commit }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        commit('increment')
        resolve()
      }, 1000)
    })
  },
}

const getters = {
  evenOrOdd: state => (state.count % 2 === 0 ? 'even' : 'odd'),
}
const counter = {
  state,
  mutations,
  actions,
  getters,
}

export const store = createStore({
  modules: {
    counter,
  },
})
