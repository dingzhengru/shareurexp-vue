<template>
<div>
    <div class="article-search">
        <div class="row article-search-row">
            <div class="col-12 col-sm-8 col-md-8">
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
                    <i class="searchclear fas fa-times-circle"
                       @click="search.text=''"
                       v-if="search.text"></i>
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
            <div class="col">
                <!-- <v-select label="name"
                          :reduce="name => name.id"
                          :options="getTags"
                          v-model="article.tags"
                          multiple 
                          placeholder="選擇科系(複選)"
                          required/> -->
            </div>
        </div>
    </div>
    <div class="articles">
        <div class="row articles-row"
             v-for="(article, index) in getArticlesFilter"
             :key="index"> 
            <div class="col-6 col-sm-4 col-md-6 articles-left">
                <div class="articles-title"
                     @click="goArticle(article.id)">
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
                </div>
                <div>
                    <i class="fa fa-clock fa-1x"></i> 
                    {{ dayjs(article.created.toMillis()).from(dayjs()) }}
                </div>
            </div>
        </div>
    </div>

    <!-- 分頁 -->

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
            orderFields: [
                { name: '最新文章', val: 'created' },
                { name: '最新回覆', val: 'created' },
                { name: '最多回覆', val: 'created' },
                { name: '最舊文章', val: 'created' },
                { name: '最多瀏覽', val: 'created' },
                { name: '最少瀏覽', val: 'created' },
            ],
            sort: {
                orderByField: 'created',
                isAsc: false
            },
            search: {
                text: '',
                field: ''
            },
            pagination :{
                currentPage: 1,
                pageSize: 5
            },
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
    },
    computed: {
        getArticles: function() {
            return this.$store.getters['articles/getData'];
        },
        getArticlesFilter: function() {
            let users = this.$store.getters['users/getData'];
            return this.$store.getters['articles/getArticlesFilter'](users)
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
        sortArticles: function(field) {
            let sort = this.$store.state.articles.sort;
            sort.orderByField = field;
            sort.isAsc = !sort.isAsc;
            this.$store.commit('articles/setSort', sort);
        },
        limitContent: function(content) {
            let length = content.length;
            let limit = this.contentSize;
            content = content.replace(/<[^>]*>/g, '')
            if(length <= limit)
                return content;
            return content.substring(0, limit);
        },
        changePage: function(currentPage) {
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
            this.$store.commit('articles/setPage', this.pagination);
        },
        'pagination.pageSize': function(value, oldValue) {
            this.$store.commit('articles/setPage', this.pagination);
        },
    }
}
</script>

<style lang="scss" scoped>


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
    .searchclear {
        position: absolute;
        right: 120px;
        top: 0;
        bottom: 0;
        height: 14px;
        margin: auto;
        font-size: 14px;
        cursor: pointer;
        color: #ccc;
    }
}

.articles {
    padding-bottom: 20px;

    .articles-row {
        font-family: Microsoft YaHei;
        border-top: 1px solid #F0F3F4; 
        padding-bottom: 10px;

        &:nth-child(even) {
            background-color: #F0F3F4;
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
                color: #7F8C8D;
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
</style>