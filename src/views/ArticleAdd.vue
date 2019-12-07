<template>
<div v-if="getCurrentUser">
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
    <h2>撰寫新文章</h2>
    <form class="article-form" 
          @submit.prevent="addArticle(article)">
        <div class="row">
            <div class="article-title col-12">
                <input class="form-control" 
                       v-model="article.title"
                       placeholder="輸入標題"
                       required>
            </div>
        </div>
        <div class="row">
            <div class="article-content col-12">
                <vue-editor 
                    id="editor"
                    useCustomImageHandler
                    @image-added="handleImageAdded"
                    :editorToolbar="editorToolbar"
                    v-model="article.content" 
                    placeholder="輸入內容"
                    required
                ></vue-editor>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                <v-select label="name"
                          :reduce="name => name.id"
                          :options="getSchools"
                          v-model="article.school" 
                          placeholder="選擇學校(可輸入文字搜尋)"
                          required/>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                <v-select label="name"
                          :reduce="name => name.id"
                          :options="getTags"
                          v-model="article.tags"
                          multiple 
                          placeholder="選擇科系(複選)"
                          required/>
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
import imgurClient from '../imgur-api.js'
import { VueEditor } from 'vue2-editor';
import editorToolbar from '../editor-toolbar.js';
import vSelect from 'vue-select'

export default {
    components: { 
        VueEditor,
        vSelect
    },
    data: function() {
        return {
            article: {
                id: null,
                title: '',
                content: '',
                creator: null,
                posts: [],
                school: null,
                tags: [],
                created: '',
                editDate: '',
                latestPostDate: '',
                pushs: [],
                ipViews: [],
            },
            contentMin: 10,
            titleMax: 30,
            errors: [],
            editorToolbar: editorToolbar
        }
    },
    created: function() {
        // 沒登入就讓他轉到首頁
        this.setUserChecker(() => {
            if(!this.getCurrentUser)
                this.$router.push('/')
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
        getTags() {
            return this.$store.getters['tags/getData'];
        },
        getSchools() {
            return this.$store.getters['schools/getData'];
        },
    },
    methods: {
        addArticle: function(article) {
            this.errors = [];

            article.creator = this.getCurrentUser.id;

            if(!this.validArticle(article))
                return
            this.$store.dispatch('articles/addDataAction', article)
            .then((data) => {
                this.$router.push({
                    name: 'article',
                    params: { id: data.id }
                })
            })
            .catch((error) => {
                // console.log(error);
            })
        },
        validArticle: function(article) {
            let errors = [];
            let contentMin = this.contentMin
            let titleMax = this.titleMax

            if(_.isEmpty(article.title)) {
                errors.push('標題不能為空')
            }
            if(article.title.length > titleMax) {
                errors.push('標題過長')
            }
            if(_.isEmpty(article.content) || article.content.length <= contentMin ) {
                errors.push('內容過短')
            }
            if(article.school == null) {
                errors.push('請選擇一所學校')
            }
            if(_.isEmpty(article.tags)) {
                errors.push('最少選擇一個系所')
            }
            this.errors = errors;
            return _.isEmpty(errors)
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
                let user = this.$store.getters['users/getDataById'](this.article.creator);
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

.message-div {
    
}

.article-form {
    .row {
        padding-bottom: 20px;
    }
    .article-editor-div {
        margin-left: 50px;
        width: 800px;
    }
}

</style>