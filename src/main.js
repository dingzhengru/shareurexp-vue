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
import '@fortawesome/fontawesome-free/js/fontawesome.min.js'
import '@fortawesome/fontawesome-free/js/solid.min.js'

import 'dayjs/locale/zh-tw.js'

import 'vue-select/dist/vue-select.css'

import VueTippy, { TippyComponent } from "vue-tippy";

Vue.use(VueTippy);
Vue.component("tippy", TippyComponent);

import firebaseInit from './firebase-init.js'

// firebaseInit()


new Vue({
    router,
    store,
    beforeCreate: function(){
        // set auth
        this.$store.dispatch('auth/setAuthStateChanged')
        .then(() => {
            // console.log('user ready')
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

        // set notices
        this.$store.dispatch('notices/getDataAction')
    },
    created: function() {
        let userTimer = setInterval(() => {

            // check user ready 等待auth準備好
            if(!this.$store.state.auth.isReady)
                return
            // check sign in 確定沒登入就結束
            if(!this.$store.state.auth.isSignIn) {
                this.$store.commit('users/setCurrentUser', null);
                clearInterval(userTimer)
                return
            }
                
            // 用auth uid去找 user 並設置 currentUser
            let uid = this.$store.getters['auth/getData'].uid || null;
            this.$store
                .dispatch('users/getUserByUid', uid)
                .then(data => {
                    // set Current user
                    this.$store.commit('users/setCurrentUser', data);

                    // 監看CurrentUser 不用監看整個users
                    this.$store.dispatch('users/setWatchById', data.id);
                    clearInterval(userTimer);
            })
        }, 500)
    },
    render: h => h(App),
}).$mount('#app')
