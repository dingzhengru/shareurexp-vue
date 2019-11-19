<template>
<div>
    <h1>User</h1>
    <p>User: {{ this.$store.getters['auth/getData'].uid }}</p>  
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
            articles: null,
            posts: null
        }
    },
    beforeCreate: function() {
        // 因為不確定$store.state.user甚麼時候準備好
        // 所以使用setInterval ，直到
        let articlesTimer = setInterval(() => {
            console.log('updata articles')
            this.updateArticles()
            .then((data) => {
                this.articles = data
                clearInterval(articlesTimer)
            })
            .catch((error) => {
                if(!this.$store.state.auth.isSignIn)
                    clearInterval(articlesTimer)
            })
        } , 200)
        let postsTimer = setInterval(() => {
            console.log('updata posts')
            this.updatePosts()
            .then((data) => {
                this.posts = data
                clearInterval(postsTimer)
            })
            .catch((error) => {
                if(!this.$store.state.auth.isSignIn)
                    clearInterval(postsTimer)
            })
        }, 200)
    },
    computed: {
        getArticles() {
            return this.articles
        },
        getPosts() {
            return this.posts
        }
    },
    methods: {
        updateArticles: function() {
            return new Promise((resolve, reject) => {
                let user = this.$store.getters['auth/getData']

                // check user is ready
                if(_.isEmpty(user))
                    reject('user not ready or not sign in')

                db.collection('articles')
                  .where('creator', '==' , user.uid)
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
        updatePosts: function() {
            return new Promise((resolve, reject) => {
                let user = this.$store.getters['auth/getData']

                if(_.isEmpty(user))
                    reject('user not ready or not sign in')
                
                db.collection('posts')
                  .where('creator', '==' , user.uid)
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