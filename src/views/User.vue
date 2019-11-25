<template>
<div>
    <h1>使用者頁面</h1>
    <div class="row user-row">
        <div class="col col-md-2 col-sm-6">ID</div>
        <div class="col">{{ getCurrentUser.id }}</div>
        <div class="col col-md-2 col-sm-6">Username</div>
        <div class="col">{{ getCurrentUser.username }}</div>
    </div>
    <div class="row user-row">
        <div class="col col-md-2 col-sm-6">Email</div>
        <div class="col">{{ getCurrentUser.email }}</div>
        <div class="col col-md-2 col-sm-6">Created</div>
        <div class="col">{{ dayjs(getCurrentUser.created.toMillis()).format('YYYY/MM/DD') }}</div>
    </div>
    <div class="row buttons-row">
        <div class="col">
            <button class="btn btn-primary btn-block"
                    @click="showArticles = !showArticles">
                寫過的文章
            </button>
        </div>
        <div class="col">
            <button class="btn btn-warning btn-block"
                    @click="showPosts = !showPosts">
                回過的文章
            </button>
        </div>
    </div>
    <div class="articles" v-if="showArticles">
        <h2>寫過的文章</h2>
        <table class="table">
            <tr>
                <th>標題</th>
                <th>推</th>
                <th>發表時間</th>
            </tr>
            <tr v-for="(article, index) in getPageArticles"
                :key="index">
                <td>{{ article.title }}</td>
                <td>{{ article.push }}</td>
                <td>{{ dayjs(article.created.toMillis()).format('YYYY/MM/DD hh:mm:ss') }}</td>
            </tr>
        </table>
        <div class="pagination">
            <Pagination 
            :currentPage="paginationArticles.currentPage"
            :pageSize="paginationArticles.pageSize"
            :data="getArticles"
            @change-page="changePageArticles">
            </Pagination>
        </div>
    </div>
    
        <div class="posts" v-if="showPosts">
            <h2>回過的文章</h2>
            <table class="table">
            <tr>
                <th>標題</th>
                <th>推</th>
                <th>發表時間</th>
            </tr>
            <tr v-for="(post, index) in getPagePosts"
                :key="index">
                <td>{{ getArticleById(post.article).title }}</td>
                <td>{{ post.push }}</td>
                <td>{{ dayjs(post.created.toMillis()).format('YYYY/MM/DD hh:mm:ss') }}</td>
            </tr>
        </table>
        <div class="pagination">
            <Pagination 
            :currentPage="paginationPosts.currentPage"
            :pageSize="paginationPosts.pageSize"
            :data="getPosts"
            @change-page="changePagePosts">
            </Pagination>
        </div>
    </div>
</div>
</template>


<script>

import { db } from '../firebase.js'
import _ from 'lodash'
import dayjs from 'dayjs'
import Pagination from '../components/Pagination.vue'

export default {
    components: {
        Pagination
    },
    data: function() {
        return {
            dayjs: dayjs,
            paginationArticles :{
                currentPage: 1,
                pageSize: 3
            },
            paginationPosts :{
                currentPage: 1,
                pageSize: 3
            },
            showArticles: false,
            showPosts: false
        }
    },
    created: function() {

    },
    computed: {
        getCurrentUser: function() {
            return this.$store.getters['users/getCurrentUser'];
        },
        getArticles: function() {
            let id = this.$store.getters['users/getCurrentUser'].id
            return this.$store.getters['articles/getArticlesByUserId'](id)
        },
        getPosts: function() {
            let id = this.$store.getters['users/getCurrentUser'].id
            return this.$store.getters['posts/getPostsByUserId'](id)
        },
        getArticleById: (app) => (id) => {
            return app.$store.getters['articles/getDataById'](id)
        },
        getPageArticles: function() {
            let currentPage = this.paginationArticles.currentPage;
            let pageSize = this.paginationArticles.pageSize;
            let startAt = pageSize * (currentPage - 1);
            let endAt = startAt + pageSize;

            let data = this.getArticles || [];

            return data.slice(startAt, endAt);
        },
        getPagePosts: function() {
            let currentPage = this.paginationPosts.currentPage;
            let pageSize = this.paginationPosts.pageSize;
            let startAt = pageSize * (currentPage - 1);
            let endAt = startAt + pageSize;

            let data = this.getPosts || [];

            return data.slice(startAt, endAt);
        }
    },
    methods: {
        changePageArticles: function(currentPage) {
            this.paginationArticles.currentPage = currentPage
        },
        changePagePosts: function(currentPage) {
            this.paginationPosts.currentPage = currentPage
        }
    }
}
</script>

<style lang="scss" scoped>

div.user-row {
    div.col-md {
        font-size: 0.5rem;
    }
}
div.buttons-row {
    padding-top: 20px;
    padding-bottom: 20px;
}

</style>