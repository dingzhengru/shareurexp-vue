<template>
<div id="wrapper">
    <div class="article">
        <div class="article-head">
            <div class="row article-title-row">
                <div class="col">
                    <h1>{{ getArticle.title }}</h1>
                </div>
            </div>
            <div class="row article-sub-row">
                <div class="col-12">
                    <span>#1 </span>
                    <span class="article-user">
                        <i class="fas fa-user"></i> 
                        {{ getUser(getArticle.creator).username }} 
                    </span>
                    <span class="article-date">
                        <i class="fas fa-clock"></i> 
                        {{ dayjs(getArticle.created.toMillis()).format('YYYY/MM/DD hh:mm')}}
                    </span>
                    <span class="article-date">
                        <i class="fas fa-edit"></i>
                        {{ dayjs(getArticle.editDate.toMillis()).format('YYYY/MM/DD hh:mm') }}
                    </span>
                </div>
                <div class="col-12">
                    <span class="article-school badge badge-success">
                        {{ getSchool(getArticle.school).name }}
                    </span>
                    <span class="article-tag badge badge-info" 
                          v-for="(tag, index) in getArticle.tags"
                          :key="index">
                            {{ getTag(tag).name }}
                    </span>
                </div>
            </div>
        </div>
        <hr>
        <div class="article-body">
            <div class="row article-content-row">
                <div class="col" 
                     v-html="getArticle.content">
                </div>
            </div>
        </div>
        <div class="article-bottom">
            <div class="row">
                <div class="col-12 col-sm-6 col-md-3">
                    <button class="btn-push btn btn-success btn-block btn-sm"
                            @click="pushArticle(getArticle)"
                            v-tippy="getPushTip(getArticle)"
                            :class="{disabled: isPushed(getArticle) || isPushSelf(getArticle) }">
                        <i class="fas fa-thumbs-up fa-2x"></i> 
                        <span class="push-length">
                            {{ getArticle.pushs.length }}
                        </span>
                    </button>    
                </div>
                <div class="col-12 col-sm-6 col-md-3 ml-auto"
                     v-if="getCurrentUser.id == getArticle.creator">
                    <button class="btn-edit btn btn-warning btn-block btn-sm"
                            @click="goArticleEdit(getArticle.id)">
                        <i class="fas fa-edit fa-2x"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
    
    <div class="posts">
        <div class="post border-bottom-3"
             v-for="(post, index) in getPosts"
             :key="index">
            <div class="post-head">
                <div class="row">
                    <div class="col-12">
                        <span>#{{ index + 2 }} </span>
                        <span class="post-user">
                            <i class="fas fa-user"></i> 
                            {{ getUser(post.creator).username }} 
                        </span>
                        <span class="post-date">
                            <i class="fas fa-clock"></i> 
                            {{ dayjs(post.created.toMillis()).format('YYYY/MM/DD hh:mm') }}
                        </span>
                        <span class="post-date">
                            <i class="fas fa-edit"></i>
                            {{ dayjs(post.editDate.toMillis()).format('YYYY/MM/DD hh:mm') }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="post-body">
                <div class="row post-content">
                    <div class="col"
                         v-html="post.content">
                    </div>
                </div>
            </div>
            <div class="post-bottom">
                <div class="row post-edit">
                    <div class="col-12 col-sm-6 col-md-3">
                        <button class="btn-push btn btn-success btn-block btn-sm"
                                @click="pushPost(post)"
                                v-tippy="getPushTip(post)"
                                :class="{disabled: isPushed(post) || isPushSelf(post)}">
                            <i class="fas fa-thumbs-up fa-2x"></i>
                            <span class="push-length">
                                {{ post.pushs.length }}
                            </span>
                        </button>
                    </div>
                    <div class="col-12 col-sm-6 col-md-3 ml-auto"
                         v-if="getCurrentUser.id == post.creator">
                        <button class="btn-edit btn btn-warning btn-block btn-sm"
                                @click="goPostEdit(post.id)">
                            <i class="fas fa-edit fa-2x"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>


<script>

import { db } from '../firebase.js'
import _ from 'lodash'
import dayjs from 'dayjs'
import Vue from 'vue'
import axios from 'axios'



export default {
    data: function() {
        return {
            dayjs: dayjs,
            pushSlefTip : {
                content: '不能自推',
                arrow : true, 
                trigger: 'mouseenter focus click'
            },
            pushedTip: {
                content: '已推過',
                arrow : true, 
                trigger: 'mouseenter focus click'
            },
            noPushedTip: { trigger: 'manual' }
        }
    },
    created: function() {
        this.addIp()
    },
    computed: {
        getArticle: function() {
            let id = this.$route.params.id;
            return this.$store.getters['articles/getDataById'](id)
        },
        getPosts: function() {
            let id = this.$route.params.id;
            return this.$store.getters['posts/getPostsByArticleId'](id)
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
        getCurrentUser: function() {
            return this.$store.getters['users/getCurrentUser'];
        },
        isPushed: (app) => (item) => {
            // -1 代表沒有推過
            let pushs = item.pushs || [];
            if(!Array.isArray(pushs))
                return true
            return pushs.indexOf(app.getCurrentUser.id) > -1
        },
        isPushSelf: (app) => (item) => {
            return item.creator == app.getCurrentUser.id
        },
        getPushTip: (app) => (item) => {
            if(app.isPushSelf(item))
                return app.pushSlefTip
            else if(app.isPushed(item))
                return app.pushedTip
            return app.noPushedTip
        }
    },
    methods: {
        goPostAdd: function(articleId) {
            this.$router.push({
                name: 'post-add', 
                params: { id: articleId }
            })
        }, 
        goArticleEdit: function(articleId) {
            if(!articleId)
                articleId = this.$route.params.id;
            this.$router.push({
                name: 'article-edit', 
                params: { id: articleId }
            })
        },
        goPostEdit: function(postId) {
            this.$router.push({
                name: 'post-edit', 
                params: { 
                    id: this.$route.params.id,
                    postId: postId 
                }
            })
        },
        pushArticle: function(article) {
            if(this.isPushed(article) || this.isPushSelf(article))
                return
            article.pushs.push(this.getCurrentUser.id)
            this.$store.dispatch('articles/updateDataAction', article)
            .then((data) => {
                console.log('push ok')
            })
        },
        pushPost: function(post) {
            if(this.isPushed(post) || this.isPushSelf(post))
                return
            post.pushs.push(this.getCurrentUser.id)
            this.$store.dispatch('posts/updateDataAction', post)
            .then(data => {
                console.log('push ok')
            })
        },
        addIp: function() {
            axios({
                url: 'https://api.my-ip.io/ip.json',
                method: 'GET',
                'mimeType': 'application/json',
                'Content-Type': 'application/json',
                'processData': false,
            }).then(result => {
                console.log(result.data.ip)
                
            })
        }
    }
}
</script>

<style lang="scss" scoped>

div.article {
    .article-head {
        .article-title-row {

        }
        .article-sub-row {
            .article-user {
                
            }
            .article-date {
                font-size: 0.75rem
            }
            .article-school {
                margin-right: 2px;
            }
            .article-tag {
                margin-right: 2px;
            }
        }
        
    }
    hr { margin-top: 10px; }
    .article-body {
        .article-content-row {

        }
    }
    .article-bottom {
        margin-top: 10px;
        margin-bottom: 10px;

        .btn-push {
            
        }
        .push-length {
            font-size: 1.25rem;
        }
        .btn-edit {

        }
    }
    
}

div.post {
    border-top: 5px solid #F0F3F4;
    padding-top: 10px;
    .post-user {

    }
    .post-date {
        font-size: 0.75rem
    }
    .post-bottom {
        margin-top: 10px;
        margin-bottom: 10px;

        .btn-push {

        }
        .push-length {
            font-size: 1.25rem;
        }
        .btn-edit {

        }
    }
}







</style>