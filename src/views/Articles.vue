<template>
<div v-on:scroll.passive="handleScroll">
    <div class="articles-filter row">
        <div class="articles-sort col-6">
            <select class="form-control" 
                    v-model="sort">
                <option :value="{ field:'created', isAsc:false }" selected>最新文章</option>
                <option :value="{ field:'latestPostDate', isAsc:false }">最新回覆</option>
                <option :value="{ field:'posts', isAsc:false }">最多回覆</option>
                <option :value="{ field:'created', isAsc:true }">最舊文章</option>
                <option :value="{ field:'ipViews', isAsc:false }">最多瀏覽</option>
                <option :value="{ field:'ipViews', isAsc:true }">最少瀏覽</option>
            </select>
        </div>
        <div class="articles-config col-6 text-right">
            <div class="d-inline-block mr-2">
                <button class="btn btn-secondary"
                        @click="reloadArticles()">
                    <i class="fas fa-redo-alt"></i>
                </button>
            </div>
            <div class="dropdown d-inline-block">
                <button class="btn btn-secondary dropdown-toggle" 
                        id="dropdownMenu1" 
                        data-toggle="dropdown">
                    <i class="fas fa-cog"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-right" 
                     aria-labelledby="dropdownMenu1">
                    <button class="dropdown-item"
                            :class="{ active: showmode == 'page' }"
                            @click="changeShowmode('page')">分頁顯示</button>
                    <button class="dropdown-item"
                            :class="{ active: showmode == 'scroll' }"
                            @click="changeShowmode('scroll')">下拉顯示</button>
                </div>
            </div>
        </div>
    </div>
    <div class="articles">
        <div class="row articles-row"
             v-for="(article, index) in getArticlesFilter"
             :key="index"
             @click="goArticle(article.id)"> 
            <div class="col-6 col-sm-4 col-md-6 articles-left">
                <div class="articles-title">
                    {{ article.title }}
                </div>
                <div class="articles-content"
                     v-html="limitContent(article.content)">
                </div>
            </div>
            <div class="col-3 col-sm col-md articles-center">
                <div class="articles-tags">
                    <span class="badge badge-success">
                        {{ getSchool(article.school).name }}
                    </span>
                    <span class="badge badge-info"
                          v-for="(tag, index) in article.tags"
                          :key="index">
                        {{ getTag(tag).name }}
                    </span>
                </div>
            </div>
            <div class="col-3 col-sm col-md articles-right">
                <div>
                    <i class="fa fa-user fa-1x"></i> 
                    {{ getUser(article.creator).username }}
                </div>
                <div>
                    <i class="fa fa-thumbs-up fa-1x"></i> 
                    {{ article.pushs.length }}
                    <i class="fa fa-comment fa-1x"></i> 
                    {{ article.posts.length }}
                    <i class="fas fa-eye fa-1x"></i>
                    {{ article.ipViews.length}}
                </div>
                <div>
                    <i class="fa fa-clock fa-1x"></i> 
                    {{ dayjs(article.created.toMillis()).from(dayjs()) }}
                </div>
            </div>
        </div>
    </div>

    <!-- 分頁 -->
    <div class="d-flex">
        <div class="pagination mx-auto"
             v-if="showmode == 'page'">
            <Pagination 
            :currentPage="pagination.currentPage"
            :pagesize="pagination.pagesize"
            :data="getSearchArticles"
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
import relativeTime from 'dayjs/plugin/relativeTime'
import zhTW from  'dayjs/locale/zh-tw';

dayjs.locale(zhTW)
dayjs.locale('zh-tw')
dayjs.extend(relativeTime)


export default {
    components: {
        Pagination
    },
    data: function() {
        return {
            dayjs: dayjs,
            sort: {
                field: 'created',
                isAsc: false
            },
            search: {
                text: '',
                field: ''
            },
            pagination :{
                currentPage: 1,
                pagesize: 5
            },
            showmode: 'page', // page, scroll
            contentSize: 50
        }
    },
    created: function() {
        // 設置分頁
        this.$store.commit('articles/setPage', this.pagination);

        // 從query上拿取搜尋字串
        this.search.text = this.$route.query.searchText || '';

        // 之後就把query清空
        if(this.search.text)
            this.$router.replace(this.$route.path)
        
        // 設置使用者設定 showmode
        this.setUserChecker(() => {
            this.showmode = this.getCurrentUser.settings.showmode
            this.pagination.pagesize = Number(this.getCurrentUser.settings.pagesize)
        })
        

        window.addEventListener('scroll', this.handleScroll, { passive: true });
    },
    beforeDestroy: function() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    computed: {
        getCurrentUser: function() {
            return this.$store.getters['users/getCurrentUser'];
        },
        authIsReady: function() {
            return this.$store.getters['auth/getIsReady'];
        },
        authIsSignIn: function() {
            return this.$store.getters['auth/getIsSignIn'];
        },
        getArticles: function() {
            return this.$store.getters['articles/getData'];
        },
        getUsers: function() {
            return this.$store.getters['users/getData'];
        },
        getSchools: function() {
            return this.$store.getters['schools/getData'];
        },
        getTags: function() {
            return this.$store.getters['tags/getData'];
        },
        getArticlesSearch: function() {
            return this.$store.getters['articles/getSearch'];
        },
        getSearchArticlesByTitle: function(){
            let articles = this.getArticles

            let searchText = this.getArticlesSearch.text
            let searchField = this.getArticlesSearch.field

            let filterArticles = []

            filterArticles = articles.filter(article => {
                return article.title
                       .toLowerCase()
                       .includes(searchText.toLowerCase())
            })
            return filterArticles
        },
        getSearchArticlesByContent: function(){
            let articles = this.getArticles

            let searchText = this.getArticlesSearch.text
            let searchField = this.getArticlesSearch.field

            let filterArticles = []

            filterArticles = articles.filter(article => {
                return article.content
                       .toLowerCase()
                       .includes(searchText.toLowerCase())
            })
            return filterArticles
        },
        getSearchArticlesByCreator: function(){
            let articles = this.getArticles
            let users = this.getUsers

            let searchText = this.getArticlesSearch.text
            let searchField = this.getArticlesSearch.field

            let filterArticles = []
            let filterUsers = []

            filterUsers = users.filter(user => {
                return user.username
                       .toLowerCase()
                       .includes(searchText.toLowerCase())
            })
            filterArticles = filterUsers.flatMap(user => {
                return this.$store.getters['articles/getArticlesByUserId'](user.id)
            })
            return filterArticles
        },
        getSearchArticlesByTags: function(){
            let articles = this.getArticles
            let schools = this.getSchools
            let tags = this.getTags

            let searchText = this.getArticlesSearch.text
            let searchField = this.getArticlesSearch.field

            let filterArticles = []
            let filterSchools = []
            let filterTags = []

            // schools
            filterSchools = schools.filter(school => {
                return school.name
                       .toLowerCase()
                       .includes(searchText.toLowerCase())
            })
            filterSchools = filterSchools.flatMap(school => {
                return this.$store.getters['articles/getArticlesBySchoolId'](school.id)
            })

            // tags
            filterTags = tags.filter(tag => {
                return tag.name
                       .toLowerCase()
                       .includes(searchText.toLowerCase())
            })
            filterTags = filterTags.flatMap(tag => {
                return this.$store.getters['articles/getArticlesByTagId'](tag.id)
            })
            filterArticles = filterArticles
                            .concat(filterSchools)
                            .concat(filterTags)
                            .filter((item, index, self) => self.indexOf(item) == index)

            return filterArticles
        },
        getSearchArticles: function() {
            
            let searchText = this.getArticlesSearch.text
            let searchField = this.getArticlesSearch.field
            let articles = this.getArticles

            let filterArticles = []

            try {
                if(!searchField) {
                    // search all 只要任何一個有包含 就回傳true
                    filterArticles = articles.filter(article => {
                        if(this.getSearchArticlesByCreator.indexOf(article) >= 0)
                            return true
                        if(this.getSearchArticlesByTags.indexOf(article) >= 0)
                            return true
                        if(this.getSearchArticlesByTitle.indexOf(article) >= 0)
                            return true
                        if(this.getSearchArticlesByContent.indexOf(article) >= 0)
                            return true
                        return false
                    })

                } else if(searchField == 'creator') {
                    filterArticles = this.getSearchArticlesByCreator
                } else if(searchField == 'tags') {
                    filterArticles = this.getSearchArticlesByTags
                } else if(searchField == 'title') {
                    filterArticles = this.getSearchArticlesByTitle
                } else if(searchField == 'content') {
                    filterArticles = this.getSearchArticlesByContent
                }
            } catch {
                return articles
            }
            return filterArticles
        },
        getArticlesFilter: function() { 
            let articles = this.getArticles

            let data = []

            // search => sort => page
            try {
                data = this.getSearchArticles
                data = this.$store.getters['articles/getSortArticles'](data)
                data = this.$store.getters['articles/getPageArticles'](data)
                // data = data.slice(startAt, endAt)
            } catch {
                return articles
            }
            return data
        },
        getUser: (app) => (id) => {
            return app.$store.getters['users/getDataById'](id)
        },
        getSchool: (app) => (id) => {
            return app.$store.getters['schools/getDataById'](id)
        },
        getTag: (app) => (id) => {
            return app.$store.getters['tags/getDataById'](id)
        },
    },
    methods: {
        goArticle: function(id) {
            this.$router.push({ 
                name: 'article', 
                params: { id: id }
            });
        },
        limitContent: function(content) {
            let length = content.length;
            let limit = this.contentSize;
            content = content.replace(/<[^>]*>/g, '')
            if(length <= limit)
                return content;
            return content.substring(0, limit);
        },
        reloadArticles: function() {
            this.$store.dispatch('articles/getDataAction')
            .then((data) => {
                // console.log('reload.')
            })
        },
        changeShowmode: function(showmode) {
            this.showmode = showmode

            if(this.getCurrentUser) {
                this.getCurrentUser.settings.showmode = showmode
                this.$store.dispatch('users/updateDataAction', this.getCurrentUser)
            }

            let pagesize = 5

            if(showmode == 'scroll') {
                this.pagination = {
                    pagesize: pagesize,
                    currentPage: 1
                }
            } else if(showmode == 'page') {

                if(this.getCurrentUser) {

                    pagesize = Number(this.getCurrentUser.settings.pagesize)

                    this.pagination = {
                        pagesize: pagesize,
                        currentPage: 1
                    }
                } else {
                    this.pagination = {
                        pagesize: pagesize,
                        currentPage: 1
                    }
                }
            }
        },
        handleScroll: function(event) {
            if(this.showmode != 'scroll')
                return

            let scrollY = window.scrollY || 
                          window.pageYOffset ||
                          document.documentElement.scrollTop ||
                          window.scrollTop || 
                          window.offsetTop 
            let offsetBottom = 50;

            if((document.body.scrollHeight - window.innerHeight) - scrollY <= offsetBottom) {
                if(this.pagination.pagesize >= this.getSearchArticles.length)
                    return
                this.pagination.pagesize = this.pagination.pagesize + 3;
            }
        },
        setUserChecker: function(callback, time) {
            if(!_.isNumber(time))
                time = 500

            let userChecker = setInterval(() => {
                try {
                    if(!this.authIsReady)
                        return
                    if(this.authIsSignIn == false) {
                        clearInterval(userChecker)
                        return
                    }
                    // 有登入 一定就會有currentuser 所以要避免因延遲沒執行到
                    if(this.getCurrentUser) {
                        callback()
                        clearInterval(userChecker)
                    }
                } catch {
                    clearInterval(userChecker)
                }
            }, time)
        },
        changePage: function(currentPage) {
            this.pagination.currentPage = currentPage;
        },
    },
    watch: {
        'search.text': function(value) {
            this.$store.commit('articles/setSearchText', this.search.text);
        }, 
        'search.field': function(value) {
            this.$store.commit('articles/setSearchField', this.search.field);
        },
        'pagination.currentPage': function(value, oldValue) {
            this.$store.commit('articles/setPage', this.pagination);
        },
        'pagination.pagesize': function(value, oldValue) {
            this.$store.commit('articles/setPage', this.pagination);
        },
        'sort.field': function(value, oldValue) {
            this.$store.commit('articles/setSort', this.sort);
        },
        'sort.isAsc': function(value, oldValue) {
            this.$store.commit('articles/setSort', this.sort);
        },
    }
}
</script>

<style lang="scss" scoped>


.articles-filter {
    padding-top: 15px;
    padding-bottom: 15px;

    .articles-search {
        select.select-custom {
            border-radius: 0px .25rem .25rem 0px;
        }
        select.select-custom:focus {
            border-color: none;
            box-shadow: none;
        }
    }
    
    .articles-sort {
        select {
            width: 8rem;
            min-width: 5rem;
            max-width: 100%;
        }
    }
    .articles-config {

        // 取消下拉選單的小三角形
        button.dropdown-toggle::after {
            border: 0;
            margin: 0;
        }
        .dropdown-menu {
            min-width: 5rem;

            .dropdown-item {
                
            }
        }
    }
}

.articles {
    padding-bottom: 20px;

    .articles-row {
        font-family: Microsoft YaHei;
        border-top: 1px solid #F0F3F4; 
        padding-bottom: 10px;

        &:hover {
            background-color: #F0F3F4;
            cursor: pointer;
        }
        &:first-child {
            border-top: 0px; 
        }
        .articles-left {
            .articles-title {
                font-size: 1.5rem;
                cursor: pointer;
                color: black;
            }
            .articles-title:hover {
                text-decoration: none;
            }
            .articles-content {
                font-size: 18px;
            }
        }
        .articles-center {
            .articles-tags {
                span {
                    font-size: 0.9rem;
                    margin-right: 2px;
                }
            }
        }
        .articles-right {
            div {
                font-size: 0.5rem;
            }
        }
    }
}

.pagination-row {
    text-align: center;
}
</style>