<template>
<div>
    <h1>User</h1>
    <p>Auth User: {{ this.$store.getters['auth/getData'].uid }}</p>  
    <p>User: {{ getUser }}</p>  
    <p>articles: {{ getArticles }}</p>
    <p>posts: {{ getPosts }}</p>
</div>
</template>


<script>

import { db } from '../firebase.js'
import _ from 'lodash'


export default {
    data: function() {
        return {
            user: null,
            articles: null,
            posts: null
        }
    },
    beforeCreate: function() {
        // 因為不確定$store.state.user甚麼時候準備好
        // 所以使用setInterval ，直到user ready好

        let userTimer = setInterval(() => {
            console.log('update user')

            // check user ready
            if(!this.$store.state.auth.isReady)
                return
            // check sign in
            if(!this.$store.state.auth.isSignIn)
                clearInterval(userTimer)

            this.updateUser().then((data) => {
                this.user = data;
                clearInterval(userTimer);
            });
        }, 300)

        let articlesTimer = setInterval(() => {
            console.log('update articles')

            // check user ready
            if(!this.$store.state.auth.isReady)
                return
            // check sign in
            if(!this.$store.state.auth.isSignIn)
                clearInterval(articlesTimer)

            let user = this.user;

            this.updateArticles(user).then((data) => {
                this.articles = data
                clearInterval(articlesTimer)
            })
        } , 1000)

        let postsTimer = setInterval(() => {
            console.log('update posts')

            // check user ready
            if(!this.$store.state.auth.isReady)
                return
            // check sign in
            if(!this.$store.state.auth.isSignIn)
                clearInterval(postsTimer)

            let user = this.user;

            this.updatePosts(user).then((data) => {
                this.posts = data
                clearInterval(postsTimer)
            })
        } , 1000)
    },
    computed: {
        getUser() {
            return this.user
        },
        getArticles() {
            return this.articles
        },
        getPosts() {
            return this.posts
        }
    },
    methods: {
        updateUser: function() {
            let uid = this.$store.getters['auth/getData'].uid || null;

            return new Promise((resolve, reject) => {
                this.$store.dispatch('users/getUserByUid', uid)
                .then((data) => {
                    resolve(data);
                })
                .catch((error) => reject(error))
            })
        },
        updateArticles: function(user) {
            return new Promise((resolve, reject) => {
                let id = user.id;

                db.collection('articles')
                  .where('creator', '==' , id)
                  .get()
                  .then((snapshot) => {
                    if (snapshot.docs.length > 0) {
                        resolve(snapshot.docs.map(doc => doc.data()))
                    } else {
                        resolve([])
                    }
                }).catch((error) => {
                    reject(error.message)
                })
            })
        },
        updatePosts: function(user) {
            return new Promise((resolve, reject) => {
                let id = user.id;

                db.collection('posts')
                  .where('creator', '==' , id)
                  .get()
                  .then((snapshot) => {
                    if (snapshot.docs.length > 0) {
                        resolve(snapshot.docs.map(doc => doc.data()))
                    } else {
                        resolve([])
                    }
                }).catch((error) => {
                    reject(error.message)
                })
            })
            
        }
    }
}
</script>