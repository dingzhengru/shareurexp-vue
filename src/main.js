import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import 'bootstrap/dist/css/bootstrap.min.css'

import firebaseInit from './firebase-init.js'

new Vue({
  router,
  store,
  beforeCreate: function(){
    // set user
    this.$store.dispatch('auth/setAuthStateChanged')
    .then((user) => {
        console.log('user ready')
    })
  },
  render: h => h(App),
}).$mount('#app')
