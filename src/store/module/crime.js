const state = {
  crime_type: []
}

const getters = {
  crime_type: state => state.crime_type
}

const mutations = {
  getTypeOfCrimes (state, payload) {
    state.crime_type = payload
  }
}

const actions = {
  async getTypeOfCrimes ({ state, commit }, payload) {
    console.log(payload)
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.get('/api/crime-type').then(response => {
        console.log(response.data)
        commit('getTypeOfCrimes', response.data)
      }).catch(error => console.log(error))
    })
  },
  async reportCrime ({ state, commit }, payload) {
    console.log(payload.data)
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.post('/api/report', payload.data).then(response => {
        console.log('report succes')
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
