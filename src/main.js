import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import 'bootstrap/dist/css/bootstrap.min.css'

import firebaseInit from './firebase-init.js'

// firebaseInit()

console.log(Date.now());

new Vue({
  router,
  store,
  beforeCreate: function(){
    // set user
    this.$store.dispatch('auth/setAuthStateChanged');
  },
  render: h => h(App),
}).$mount('#app')
