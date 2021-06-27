const state = {
  is_seen: false
}

const getters = {
  is_seen: state => state.is_seen
}

const mutations = {
  isSeenNotif (state, payload) {
    state.is_seen = payload
  }
}

const actions = {
  async isSeenNotif ({ state, commit }, payload) {
    console.log(payload)
    commit('isSeenNotif', payload)
  },
  async getSeenNotif ({ state, commit }, payload) {
    console.log(state.is_seen)
    return state.is_seen
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
