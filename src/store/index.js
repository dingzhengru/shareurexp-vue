import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import auth from './store-firebase-auth.js'
import users from './store-firebase-users.js'
import articles from './store-firebase-articles.js'
import posts from './store-firebase-posts.js'

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth: auth,
    users: users,
    articles: articles,
    posts: posts
  }
})
