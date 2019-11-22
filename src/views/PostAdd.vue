<template>
<div>
    <h1>回覆文章</h1>
    <h3>Post: {{ post }}</h3>
    <form @submit.prevent="addPost(post)">
        <div>
            <textarea cols="100" 
                      rows="10"
                      v-model="post.content"
                      >
            
            </textarea>
        </div>
        <button type="submit" class="btn btn-primary">送出</button>
    </form>
</div>
</template>


<script>

import { db } from '../firebase.js'
import _ from 'lodash'


export default {
    data: function() {
        return {
            post: {
                id: null,
                article: null,
                content: '',
                creator: null,
                created: '',
                editDate: '',
            },
        }
    },
    created: function() {
        this.post.article = Number(this.$route.params.id)

        let userTimer = setInterval(() => {
            console.log('update user')

            // check user ready
            if(!this.$store.state.auth.isReady) 
                return
            // check sign in
            if(!this.$store.state.auth.isSignIn)
                clearInterval(userTimer)

            let uid = this.$store.getters['auth/getData'].uid;

            // this.article.creator = this.$store.getters['users/getUserByUid'](uid)
            
            this.$store.dispatch('users/getUserByUid', uid).then((data) => {
                this.post.creator = data.id;
                clearInterval(userTimer)
            })
        }, 500)
    },
    computed: {
        getArticle: function() {
            let id = this.$route.params.id;
            if(!this.$store.getters['articles/getData'])
                return {}
            return this.$store.getters['articles/getDataById'](id)
        }
    },
    methods: {
        addPost: function(post) {
            this.$store.dispatch('posts/addDataAction', post)
            .then((data) => {
                console.log('add post success');

                this.addArticlePosts(data.id);

                this.$router.push({
                    name: 'article',
                    id: this.$route.params.id
                })
            })
            .catch((error) => {
                console.log(error);
            })
        },
        addArticlePosts: function(postId) {
            let article = this.getArticle
            article.posts.push(postId)
            this.$store.dispatch('articles/updateDataAction', article);
        }
    }
}
</script>

<style scoped>



</style>