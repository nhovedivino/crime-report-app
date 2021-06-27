const state = {
  user_details: [],
  notif_approved: [],
  login: false,
  current_count: 0
}

const getters = {
  user_details: state => state.user_details,
  notif_approved: state => state.notif_approved,
  login: state => state.login,
  current_count: state => state.current_count
}

const mutations = {
  authLogin (state, payload) {
    state.user_details = payload
    state.login = true
  },
  authLogout (state, payload) {
    state.login = false
  },
  changeLogin (state, payload) {
    state.login = false
  },
  getNotifApproved (state, payload) {
    state.notif_approved = payload
    state.current_count = payload.data.length
  }
}

const actions = {
  async authLogin ({ state, commit }, payload) {
    console.log(payload)
    try {
      const response = await axios.post('/api/login', payload)
      console.log('User signed in!')
      console.log(response)
      commit('authLogin', response.data)
    } catch (error) {
      throw new Error(error)
    }
    // window.location.reload()
  },
  async register ({ state, commit }, payload) {
    console.log(payload.data)
    try {
      const response = await axios.post('/api/register', payload.data)
      console.log(response.data)
      console.log('registered!!!!')
    } catch (error) {
      throw new Error(error)
    }
  },
  async logout ({ state, commit }, payload) {
    try {
      const response = await axios.get('/api/logout')
      console.log(response.data)
      console.log('logout!!!!')
      commit('authLogout')
    } catch (error) {
      throw new Error(error)
    }
  },
  changeLogin ({ state, commit }, payload) {
    commit('changeLogin')
  },
  async getNotifApproved ({ state, commit }, payload) {
    console.log(state.user_details.id)
    try {
      const response = await axios.get('/api/report/' + state.user_details.id + '/approved')
      console.log(response.data)
      commit('getNotifApproved', response.data)
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
