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
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.get('/api/wanted-list', payload).then(response => {
        console.log(response.data)
        commit('getWanted', response.data)
      }).catch(error => console.log(error)) // credentials didn't match
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
