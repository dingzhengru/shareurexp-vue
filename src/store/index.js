import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import auth from './store-firebase-auth.js'
import users from './store-firebase-users.js'
import articles from './store-firebase-articles.js'
import posts from './store-firebase-posts.js'
import schools from './store-firebase-schools.js'
import tags from './store-firebase-tags.js'


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
    posts: posts,
    schools: schools,
    tags: tags
  }
})
