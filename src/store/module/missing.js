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
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.get('/api/missing-person-list').then(response => {
        console.log(response.data)
        commit('getMissingPerson', response.data)
      }).catch(error => console.log(error))
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
