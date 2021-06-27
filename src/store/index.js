import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

import auth from './module/auth'
import crime from './module/crime'
import lost from './module/lost'
import missing from './module/missing'
import wanted from './module/wanted'
import notification from './module/notification'

// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      auth,
      crime,
      lost,
      missing,
      wanted,
      notification
    },
    plugins: [
      createPersistedState()
    ],

    // enable strict mode (adds overhead!)
    // for dev mode only
    // strict: process.env.DEBUGGING
    strict: false
  })

  return Store
}
