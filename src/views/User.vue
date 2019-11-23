<template>
<div>
    <h1>使用者頁面</h1>
    <div class="row user-row">
        <div class="col col-md-2 col-sm-6">ID</div>
        <div class="col">{{ user.id }}</div>
        <div class="col col-md-2 col-sm-6">Username</div>
        <div class="col">{{ user.username }}</div>
    </div>
    <div class="row user-row">
        <div class="col col-md-2 col-sm-6">Email</div>
        <div class="col">{{ user.email }}</div>
        <div class="col col-md-2 col-sm-6">Created</div>
        <div class="col">{{ dayjs(user.created.toMillis()).format('YYYY/MM/DD') }}</div>
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
            :currentPage="pagination.currentPage"
            :pageSize="pagination.pageSize"
            :data="articles"
            @change-page="changePage">
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
                <td>{{ articles[post.article].title }}</td>
                <td>{{ post.push }}</td>
                <td>{{ dayjs(post.created.toMillis()).format('YYYY/MM/DD hh:mm:ss') }}</td>
            </tr>
        </table>
        <div class="pagination">
            <Pagination 
            :currentPage="pagination.currentPage"
            :pageSize="pagination.pageSize"
            :data="posts"
            @change-page="changePage">
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
            user: null,
            articles: [],
            posts: [],
            pagination :{
                currentPage: 1,
                pageSize: 3
            },
            showArticles: false,
            showPosts: false
        }
    },
    created: function() {
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
        getPageArticles: function() {
            let currentPage = this.pagination.currentPage;
            let pageSize = this.pagination.pageSize;
            let startAt = pageSize * (currentPage - 1);
            let endAt = startAt + pageSize;

            let data = this.articles || [];

            return data.slice(startAt, endAt);
        },
        getPagePosts: function() {
            let currentPage = this.pagination.currentPage;
            let pageSize = this.pagination.pageSize;
            let startAt = pageSize * (currentPage - 1);
            let endAt = startAt + pageSize;

            let data = this.posts || [];

            return data.slice(startAt, endAt);
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
            
        },
        changePage: function(currentPage) {
            this.pagination.currentPage = currentPage
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