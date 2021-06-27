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
    try {
      const response = await axios.get('/api/crime-type')
      console.log(response.data)
      commit('getTypeOfCrimes', response.data)
    } catch (error) {
      throw new Error(error)
    }
  },
  async reportCrime ({ state, commit }, payload) {
    console.log(payload.data)
    try {
      const response = await axios.post('/api/report', payload.data)
      console.log(response)
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
