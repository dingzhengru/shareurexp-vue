<template>
<div>
    <h1>Article</h1>
    <p>id: {{ this.$route.params }}</p>
    <p>article: {{ getArticle }}</p>
    <div class="article">
        <div class="article-head">
            <h1>{{ getArticle.title }}</h1>
        </div>
        <div class="article-body">
            <div class="article-content">
                {{ getArticle.content }} (not use v-html)
            </div>
            <div class="article-content" 
                 v-html="getArticle.content">
            </div>
        </div>
    </div>
    <div class="posts"
         v-for="(post, index) in getPosts"
         :key="index">
        <div class="post-head">
            
        </div>
        <div class="post-body">
            <div class="post-content"
                 v-html="post.content">
            </div>
            {{ getUserById(post.creator) }}
        </div>
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

    }
}
</script>

<style scoped>



</style>