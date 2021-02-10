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
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.get('/api/lost-and-found-list', payload).then(response => {
        console.log(response.data)
        commit('getLostAndFound', response.data)
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
