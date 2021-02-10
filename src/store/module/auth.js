const state = {
  user_details: []
}

const getters = {
  user_details: state => state.user_details
}

const mutations = {
  authLogin (state, payload) {
    state.user_details = payload
  }
}

const actions = {
  async authLogin ({ state, commit }, payload) {
    console.log(payload)
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.post('/login', payload).then(response => {
        console.log('User signed in!')
        console.log(response)
        axios.get('/api/user', payload).then(response => {
          console.log(response.data)
          commit('authLogin', response.data.data)
        }).catch(error => console.log(error)) // credentials didn't match
      }).catch(error => console.log(error)) // credentials didn't match
    })
  },
  async register ({ state, commit }, payload) {
    console.log(payload.data)
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.post('/api/register', payload.data).then(response => {
        console.log('registered!!!!')
      }).catch(error => console.log(error)) // credentials didn't match
    })
  },
  logout ({ state, commit }, payload) {
    axios.get('/sanctum/csrf-cookie').then(response => {
      axios.get('/api/logout').then(response => {
        console.log('logout!!!!')
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
