<template>
<div>
    <h1>Article</h1>
    <button class="btn btn-warning"
            @click="goEditArticle()">編輯文章</button>
    <p>id: {{ this.$route.params }}</p>
    <p>article: {{ getArticle }}</p>
    <div class="article">
        <div class="article-head">
            <h1>{{ getArticle.title }}</h1>
        </div>
        <div class="article-body">
            <div class="article-content" 
                 v-html="getArticle.content">
            </div>
        </div>
    </div>

    <h2>Posts</h2>
    <button class="btn btn-success"
            @click="goPostAdd(getArticle.id)">回覆文章</button>
    <div class="posts"
         v-for="(post, index) in getPosts"
         :key="index">
        <div class="post-head">
            
        </div>
        <div class="post-body">
            post id: {{ post.id }}
            <div class="post-content"
                 v-html="post.content">
            </div>
            post user: {{ getUserById(post.creator).id }}
        </div>
        <hr>
    </div>
</div>
</template>


<script>

import { db } from '../firebase.js'
import _ from 'lodash'
import dayjs from 'dayjs'

// 先把store.users以id排序(因users不能刪除，所以id順序能剛好對應)
// users[id] 就會剛好是對應的user

export default {
    data: function() {
        return {
            dayjs: dayjs,
            article: null,
            posts: [],
        }
    },
    beforeCreate: function() {

    },
    computed: {
        getArticle: function() {
            let id = this.$route.params.id;
            if(!this.$store.getters['articles/getData'])
                return {}
            return this.$store.getters['articles/getDataById'](id)
        },
        getPosts: function() {
            let id = this.$route.params.id;
            if(!this.$store.getters['posts/getData'])
                return []
            return this.$store.getters['posts/getPostsByArticleId'](id)
        },
        getUserById: (app) => (id) => {
            if(!app.$store.getters['users/getData'])
                return {}
            return app.$store.getters['users/getDataById'](id)
        }
    },
    methods: {
        goPostAdd: function(articleId) {
            this.$router.push({
                name: 'post-add', 
                params: { id: articleId }
            })
        }, 
        goEditArticle: function(articleId) {
            if(!articleId)
                articleId = this.$route.params.id;
            this.$router.push({
                name: 'article-edit', 
                params: { id: articleId }
            })
        }
    }
}
</script>

<style scoped>



</style>