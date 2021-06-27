const state = {
  wanteds: []
}

const getters = {
  wanteds: state => state.wanteds
}

const mutations = {
  getWanted (state, payload) {
    state.wanteds = payload
  }
}

const actions = {
  async getWanted ({ state, commit }, payload) {
    console.log(payload)
    try {
      const response = await axios.get('/api/wanted-list', payload)
      console.log(response.data)
      commit('getWanted', response.data)
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
