const state = {
  lost_and_founds: []
}

const getters = {
  lost_and_founds: state => state.lost_and_founds
}

const mutations = {
  getLostAndFound (state, payload) {
    state.lost_and_founds = payload
  }
}

const actions = {
  async getLostAndFound ({ state, commit }, payload) {
    console.log(payload)
    try {
      const response = await axios.get('/api/lost-and-found-list', payload)
      console.log(response.data)
      commit('getLostAndFound', response.data)
    } catch (error) {
      throw new Error(error)
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
