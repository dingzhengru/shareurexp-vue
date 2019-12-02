<template>
<div>
    <div class="message-div row" v-if="getPost">
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
          @submit.prevent="editPost(getPost)">
        <div class="row">
            <div class="post-content col-12">
                <vue-editor 
                    id="editor"
                    useCustomImageHandler
                    @image-added="handleImageAdded"
                    :editorToolbar="editorToolbar"
                    v-model="getPost.content" 
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
import editorToolbar from '../editor-toolbar.js'

export default {
    components: { 
        VueEditor
    },
    data: function() {
        return {
            errors: [],
            editorToolbar: editorToolbar
        }
    },
    created: function() {
        this.setUserChecker(() => {
            if(!this.getCurrentUser)
                this.$router.push('/')
            if(this.getCurrentUser.id != this.getPost.creator) {
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
        getPost: function() {
            let id = this.$route.params.postId
            return this.$store.getters['posts/getDataById'](id)
        },
        getArticle: function() {
            let id = this.getPost.article || null;

            if(!this.$store.getters['articles/getData'])
                return {}
            return this.$store.getters['articles/getDataById'](id)
        }
    },
    methods: {
        editPost: function(post) {
            this.$store.dispatch('posts/updateDataAction', post)
            .then((data) => {
                this.$router.push({
                    name: 'article',
                    id: this.$route.params.id
                })
            })
            .catch((error) => {
                console.log(error);
            })
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
                let user = this.$store.getters['users/getDataById'](this.getPost.creator);
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
}

</style>