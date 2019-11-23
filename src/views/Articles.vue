<template>
<div>
    <div class="article-search">
        <div class="row article-search-row">
            <div class="col-8">
                <div class="input-group flex-nowrap">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="addon-wrapping">
                            <i class="fas fa-search"></i>
                        </span>
                    </div>
                    <input type="text" 
                           class="form-control" 
                           v-model="search.text"
                           placeholder="搜尋文章" 
                           aria-describedby="addon-wrapping"
                    />
                    <div class="input-group-append">
                        <select class="form-control select-custom"
                                v-model="search.field">
                            <option value="">全部</option>
                            <option value="title">標題</option>
                            <option value="tags">標籤</option>
                            <option value="creator">作者</option>
                            <option value="content">文章內容</option>
                        </select>
                    </div>
                </div>

            </div>
            <div class="col"></div>
        </div>
    </div>
    <!-- article search -->
    <!-- articles -->
    <!-- <div class="articles container">
        <div class="row articles-head-row">
            <div class="col" @click="sortArticles('id')">#</div>
            <div class="col" @click="sortArticles('title')">title</div>
            <div class="col" @click="sortArticles('creator')">creator</div>
            <div class="col" @click="sortArticles('created')">created</div>
            <div class="col" >reply</div>
        </div>
        <div class="articles-body">
            <div class="row articles-row" 
                 v-for="(article, index) in getArticlesFilter"
                 :key="index"
                 @click="pushToArticle(article.id)">
                <div class="col">{{ article.id }}</div>
                <div class="col">{{ article.title }}</div>
                <div class="col">{{ getUsers[article.creator].username }}</div>
                <div class="col">{{ dayjs(article.created.toMillis()).format('YYYY/MM/DD hh:mm:ss') }}</div>
                <div class="col">{{ article.posts ? article.posts.length : 0 }}</div>
            </div>
        </div>
    </div> -->


<div class="articles">
    <div class="row articles-row"
         v-for="(article, index) in getArticlesFilter"
         :key="index"> 
        <div class="col-6 articles-left">
            <div class="articles-title">
                {{ article.title }}
            </div>
            <div class="articles-content"
                 v-html="limitContent(article.content)">
            </div>
        </div>
        <div class="col-6 articles-right">
            <div class="articles-tags">
                <span class="badge badge-success">
                    {{ getSchools[article.school] ? getSchools[article.school].name : '' }}
                </span>
                <span class="badge badge-info"
                      v-for="(tag, index) in article.tags"
                      :key="index">
                    {{ getTags[tag].name }}
                </span>
            </div>
            <i class="fa fa-user fa-1x"></i> 
            <a>{{ getUsers[article.creator].username }}</a>
            <div>
                <span class="fa fa-thumbs-up fa-1x"></span> 
                推數
                <span class="fa fa-comment fa-1x"></span> 
                {{ article.posts.length }}
                <span class="fa fa-clock-o fa-1x"></span> 
                {{ dayjs(article.created.toMillis()).format('YYYY/MM/DD hh:mm:ss') }}
            </div>
        </div>
    </div>
</div>






    <div class="pagination">
        <Pagination 
        :currentPage="pagination.currentPage"
        :pageSize="pagination.pageSize"
        :data="getArticles"
        @change-page="changePage">
        </Pagination>
    </div>
</div>
</template>


<script>

import { db } from '../firebase.js'
import _ from 'lodash'
import dayjs from 'dayjs'

import Pagination from '../components/Pagination.vue'
// 先把store.users以id排序(因users不能刪除，所以id順序能剛好對應)
// users[id] 就會剛好是對應的user


export default {
    components: {
        Pagination
    },
    data: function() {
        return {
            dayjs: dayjs,
            articles: [],
            users: [],
            search: {
                text: '',
                field: ''
            },
            pagination :{
                currentPage: 1,
                pageSize: 5
            },
            contentSize: 30
        }
    },
    created: function() {
        this.$store.commit('articles/setPage', this.pagination)
    },
    computed: {
        getArticles() {
            return this.$store.getters['articles/getData'];
        },
        getUsers() {
            return this.$store.getters['users/getData'];
        },
        getTags() {
            return this.$store.getters['tags/getData'];
        },
        getSchools() {
            return this.$store.getters['schools/getData'];
        },
        getArticlesFilter() {
            return this.$store.getters['articles/getArticlesFilter'](this.getUsers)
        },
    },
    methods: {
        pushToArticle(id) {
            this.$router.push({ 
                name: 'article', 
                params: { id: id }
            });
        },
        sortArticles(field) {
            let sort = this.$store.state.articles.sort;
            sort.orderByField = field;
            sort.isAsc = !sort.isAsc;
            this.$store.commit('articles/setSort', sort);
        },
        limitContent(content) {
            let length = content.length;
            let limit = this.contentSize;
            content = content.replace(/<[^>]*>/g, '')
            if(length <= limit)
                return content;
            return content.substring(0, limit);
        },
        changePage(currentPage) {
            this.pagination.currentPage = currentPage;
        }
    },
    watch: {
        'search.text': function(value) {
            this.$store.commit('articles/setSearch', this.search);
        }, 
        'search.field': function(value) {
            this.$store.commit('articles/setSearch', this.search);
        },
        'pagination.currentPage': function(value, oldValue) {
            console.log(123);
            this.$store.commit('articles/setPage', this.pagination);
        },
        'pagination.pageSize': function(value, oldValue) {
            this.$store.commit('articles/setPage', this.pagination);
        },
    }
}
</script>

<style lang="scss" scoped>

// .articles-head-row {
//     background-color: #1ABC9C;
//     font-weight: bold;
//     font-size: 20px;
// }

// .articles-row {
//     padding-top: 5px;
//     padding-bottom: 5px;
//     border-top: 1px black solid;
// }
// .articles-row:hover {
//     background-color: gray;
//     cursor: pointer;
// }


.article-search {
    padding-top: 15px;
    padding-bottom: 15px;

    select.select-custom {
        border-radius: 0px .25rem .25rem 0px;
    }
    select.select-custom:focus {
        border-color: none;
        box-shadow: none;
    }
}

.articles {
    .articles-row {
        font-family: Microsoft YaHei;
        border-top: 1px solid #F0F3F4; 
        padding-bottom: 10px;
        &:first-child {
            border-top: 0px; 
        }
        .articles-title {
            font-size: 1.5rem;
        }
        .articles-content {
            font-size: 18px;
        }
        .articles-tags {
            span {
                font-size: 14px;
                margin-right: 2px;
            }
        }
    }
}
</style>