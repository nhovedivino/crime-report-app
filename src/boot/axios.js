import Vue from 'vue'
import axios from 'axios'

// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8000'

Vue.prototype.$axios = axios
window.axios = axios
