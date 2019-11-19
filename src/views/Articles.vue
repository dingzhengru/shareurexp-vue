<template>
<div>
    <h1>Articles</h1>
    <p>User: {{ this.$store.getters['user/getData'].uid }}</p>  
    <p>articles: {{ getArticles }}</p>
    <div class="container">
        <div class="row">
            <div class="col">#</div>
            <div class="col">title</div>
            <div class="col">creator</div>
            <div class="col">created</div>
        </div>
        <div class="row" 
             v-for="(article, index) in articlesFilter"
             :key="article.id">
            <div class="col">{{ index }}</div>
            <div class="col">{{ article.title }}</div>
            <div class="col">{{ article.creator }}</div>
            <div class="col">{{ dayjs(article.created.toMillis()).format('YYYY/MM/DD hh:mm:ss') }}</div>
        </div>
    </div>
</div>
</template>


<script>

import { db } from '../firebase.js'
import _ from 'lodash'
import dayjs from 'dayjs'


export default {
    data: function() {
        return {
            articles: null,
            dayjs: dayjs,
        }
    },
    beforeCreate: function() {
        this.$store.dispatch('articles/getDataAction')
        .then((data) => {
            this.articles = data;
        })
    },
    computed: {
        getArticles() {
            return this.articles;
        },
        articlesFilter() {
            return this.articles;
        }
    },
    methods: {
        
    }
}
</script>