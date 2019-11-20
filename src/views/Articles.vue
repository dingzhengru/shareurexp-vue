<template>
<div>
    <h1>Articles</h1>
    <!-- <p>articles: {{ getArticles }}</p> -->
    <!-- <p>users: {{ getUsers }}</p> -->
    <div class="container">
        <div class="row articles-head-row">
            <div class="col">#</div>
            <div class="col">title</div>
            <div class="col">creator</div>
            <div class="col">created</div>
        </div>
        <div class="articles-body">
            <div class="row articles-row" 
                 v-for="(article, index) in articlesFilter"
                 :key="index"
                 @click="pushToArticle(article.id)">
                <div class="col">{{ article.id }}</div>
                <div class="col">{{ article.title }}</div>
                <div class="col">{{ article.posts ? article.posts.length : 0 }}</div>
                <div class="col">{{ getUsers[article.creator].username }}</div>
                <div class="col">{{ dayjs(article.created.toMillis()).format('YYYY/MM/DD hh:mm:ss') }}</div>
            </div>
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
            articles: [],
            users: []
        }
    },
    beforeCreate: function() {
        
    },
    computed: {
        getArticles() {
            return this.$store.getters['articles/getData'];
        },
        articlesFilter() {
            return this.$store.getters['articles/getData'];
        },
        getUsers() {
            return this.$store.getters['users/getData'];
        }
    },
    methods: {
        pushToArticle(id) {
            this.$router.push({ 
                name: 'article', 
                params: { id: id }
            });
        }
    }
}
</script>

<style scoped>

.articles-head-row {
    background-color: #1ABC9C;
    font-weight: bold;
    font-size: 20px;
}

.articles-row {
    padding-top: 5px;
    padding-bottom: 5px;
    border-top: 1px black solid;
}
.articles-row:hover {
    background-color: gray;
    cursor: pointer;
}

</style>