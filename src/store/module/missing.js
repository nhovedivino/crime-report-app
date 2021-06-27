const state = {
  missing_persons: {}
}

const getters = {
  missing_persons: state => state.missing_persons
}

const mutations = {
  getMissingPerson (state, payload) {
    state.missing_persons = payload
  }
}

const actions = {
  async getMissingPerson ({ state, commit }, payload) {
    console.log(payload)
    try {
      const response = await axios.get('/api/missing-person-list')
      console.log(response.data)
      commit('getMissingPerson', response.data)
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
