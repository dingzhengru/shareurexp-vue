<template>
<div>
    <div class="message-div row">
        <div class="col"></div>
        <div class="col-8 text-center">
            <div class="alert alert-danger"
                 v-for="(error, index) in errors"
                 :key="index">
                {{ error }}
            </div>
        </div>
        <div class="col"></div>
    </div>
    <h2>回覆文章: {{ getArticle.title }}</h2>
    <form class="post-form" 
          @submit.prevent="addPost(post)">
        <div class="row">
            <div class="post-content col-12">
                <vue-editor 
                    id="editor"
                    useCustomImageHandler
                    @image-added="handleImageAdded"
                    :editorToolbar="editorToolbar"
                    v-model="post.content" 
                    placeholder="輸入內容"
                    required
                ></vue-editor>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <button type="submit" class="btn btn-primary btn-lg btn-block">
                    送出
                </button>
            </div>
        </div>
    </form>
</div>
</template>


<script>
import _ from 'lodash'
import axios from 'axios';
import { VueEditor } from 'vue2-editor';
import imgurClient from '../imgur-api.js'
import editorToolbar from '../editor-toolbar.js';

export default {
    components: { 
        VueEditor
    },
    data: function() {
        return {
            post: {
                id: null,
                article: null,
                content: '',
                creator: null,
                created: '',
                editDate: '',
                pushs: []
            },
            errors: [],
            editorToolbar:editorToolbar
        }
    },
    created: function() {
        this.post.article = Number(this.$route.params.id)

        // 取得 user id 給 creator
        this.setUserChecker(() => {
            this.post.creator = this.getCurrentUser.id;
        })
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
        getArticle: function() {
            let id = this.$route.params.id;
            return this.$store.getters['articles/getDataById'](id)
        },
        getPosts: function() {
            let id = this.getArticle.id
            return this.$store.getters['posts/getPostsByArticleId'](id)
        },
        getUserById: (app) => (id) => {
            return app.$store.getters['users/getDataById'](id)
        }
    },
    methods: {
        addPost: function(post) {
            this.$store.dispatch('posts/addDataAction', post)
            .then((data) => {

                // add id to article.posts
                // add created to article.latestPostDate
                this.addArticlePosts(data);

                // add notice
                this.addNotice(data)
                
                this.$router.push({
                    name: 'article',
                    id: this.$route.params.id
                })
            })
            .catch((error) => {
                // console.log(error);
            })
        },
        addArticlePosts: function(post) {
            this.getArticle.posts.push(post.id)
            this.getArticle.latestPostDate = post.created
            this.$store.dispatch('articles/updateDataAction', this.getArticle)
            .then((data) => {
                // console.log(data.posts)
            })
        },
        addNotice: function(post) {
            let notice = {
                creator: post.creator,
                article: post.article,
                type: 'post',
                content: '有新的回覆',
                readUsers: [],
            }
            this.$store.dispatch('notices/addDataAction', notice)
            .then(data => {
                // 給文章與回覆的使用者 通知
                let users = []

                // 加入整串使用者
                users.push(this.getArticle.creator)
                this.getPosts.forEach(post => users.push(post.creator))

                // 去除重複使用者 & 刪除自己
                users = users.filter((item, index, self) => {
                    return self.indexOf(item) == index && 
                           item != post.creator
                })

                // 每個使用者添加一個通知(要用 unshift 把新通知放在最前面)
                users.forEach(userId => {
                    let user = this.getUserById(userId)

                    // unshift
                    user.notices.unshift(data.id)
                    this.$store.dispatch('users/updateDataAction', user)
                })
            })
        },
        setUserChecker: function(callback, time) {
            if(!_.isNumber(time))
                time = 500

            let userChecker = setInterval(() => {
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
            }, time)
        },
        handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {

            let formData = new FormData();
            formData.append("image", file);
            // formData.append("user", this.article.creator);


            // imgur api
            axios({
                url: 'https://api.imgur.com/3/image',
                method: 'POST',
                'timeout': 0,
                'headers': {
                    'Authorization': 'Client-ID ' + imgurClient.id
                },
                'processData': false,
                'mimeType': 'multipart/form-data',
                'content-type': false,
                'data': formData
            }).then(result => {
                let url = result.data.data.link;

                // 將圖片網址加進使用者資料中
                let user = this.$store.getters['users/getDataById'](this.post.creator);
                user.images.push(url);
                this.$store.dispatch('users/updateDataAction', user);

                Editor.insertEmbed(cursorLocation, "image", url);
                resetUploader();
            })
        }
    }
}
</script>

<style lang="scss" scoped>


.post-form {
    .row {
        padding-bottom: 20px;
    }
    .post-editor-div {
        margin-left: 50px;
        width: 800px;
    }
}

</style>