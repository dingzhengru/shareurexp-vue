import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

Vue.config.productionTip = false

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import '@fortawesome/fontawesome-free/css/fontawesome.min.css'
import '@fortawesome/fontawesome-free/css/solid.min.css'

import 'vue-select/dist/vue-select.css'

import firebaseInit from './firebase-init.js'

// firebaseInit()


new Vue({
    router,
    store,
    beforeCreate: function(){
        // set user
        this.$store.dispatch('auth/setAuthStateChanged')
        .then(() => {
            console.log('user ready')
        })

        // set articles
        this.$store.dispatch('articles/getDataAction')
        
        // set users
        this.$store.dispatch('users/getDataAction')

        // set posts
        this.$store.dispatch('posts/getDataAction')

        // set schools
        this.$store.dispatch('schools/getDataAction')

        // set tags
        this.$store.dispatch('tags/getDataAction')
    },
    created: function() {
        let userTimer = setInterval(() => {
            console.log('update user')

            // check user ready
            if(!this.$store.state.auth.isReady)
                return
            // check sign in
            if(!this.$store.state.auth.isSignIn)
                clearInterval(userTimer)

            let uid = this.$store.getters['auth/getData'].uid || null;
            this.$store
                .dispatch('users/getUserByUid', uid)
                .then(data => {
                    this.$store.commit('users/setCurrentUser', data);
                    clearInterval(userTimer);
            })
        }, 500)
    },
    render: h => h(App),
}).$mount('#app')
