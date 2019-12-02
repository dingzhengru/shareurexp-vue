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
    <h2>編輯文章</h2>
    <form class="form article-form" @submit.prevent="editArticle(getArticle)">
        <div class="article">
            <div class="row">
                <div class="article-title col-12">
                    <input class="form-control" 
                           v-model="getArticle.title"
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
                        v-model="getArticle.content" 
                        placeholder="輸入內容"
                    ></vue-editor>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                <v-select label="name"
                          :reduce="name => name.id"
                          :options="getSchools"
                          v-model="getArticle.school" 
                          placeholder="選擇學校(可輸入文字搜尋)"/>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                <v-select label="name"
                          :reduce="name => name.id"
                          :options="getTags"
                          v-model="getArticle.tags"
                          multiple 
                          placeholder="選擇科系(複選)"/>
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <button type="submit" class="btn btn-primary btn-lg btn-block">
                    儲存編輯
                </button>
            </div>
        </div>
    </form>
</div>
</template>


<script>
import _ from 'lodash';
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
            errors: [],
            editorToolbar: editorToolbar
        }
    },
    created: function() {
        // 設置UserChecker檢查此用戶是否為 文章創作者
        this.setUserChecker(() => {
            if(this.getCurrentUser.id != this.getArticle.creator) {
                this.$router.push('/')
            } 
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
        getUser: (app) => (id) => {
            return app.$store.getters['users/getDataById'](id)
        },
        getTags() {
            return this.$store.getters['tags/getData'];
        },
        getSchools() {
            return this.$store.getters['schools/getData'];
        },
    },
    methods: {
        editArticle: function(article) {
            this.$store.dispatch('articles/updateDataAction', article)
            .then((data) => {
                this.$router.push({
                    name: 'article',
                    params: { id: data.id }
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
                if(this.getCurrentUser) {
                    callback()
                    clearInterval(userChecker)
                }
            }, 500)
        },
        handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {

            let formData = new FormData();
            formData.append("image", file);

            axios({
                url: "http://localhost:3000/upload-image",
                method: "POST",
                data: formData,
            })
            .then(result => {
                console.log(result.data);
                let url = result.data; // Get url from response
                Editor.insertEmbed(cursorLocation, "image", url);
                resetUploader();
            })
            .catch(err => {
                console.log(err);
            });
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