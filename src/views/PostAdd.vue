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

        let userTimer = setInterval(() => {
            console.log('update user')

            // check user ready
            if(!this.$store.state.auth.isReady) 
                return
            // check sign in
            if(!this.$store.state.auth.isSignIn)
                clearInterval(userTimer)

            let uid = this.$store.getters['auth/getData'].uid;

            // this.article.creator = this.$store.getters['users/getUserByUid'](uid)
            
            this.$store.dispatch('users/getUserByUid', uid).then((data) => {
                this.post.creator = data.id;
                clearInterval(userTimer)
            })
        }, 500)
    },
    computed: {
        getArticle: function() {
            let id = this.$route.params.id;
            return this.$store.getters['articles/getDataById'](id)
        }
    },
    methods: {
        addPost: function(post) {
            this.$store.dispatch('posts/addDataAction', post)
            .then((data) => {
                console.log('add post success');

                // add id to article.posts
                // add created to article.latestPostDate
                this.addArticlePosts(data);
                
                this.$router.push({
                    name: 'article',
                    id: this.$route.params.id
                })
            })
            .catch((error) => {
                console.log(error);
            })
        },
        addArticlePosts: function(post) {
            this.getArticle.posts.push(post.id)
            this.getArticle.latestPostDate = post.created
            this.$store.dispatch('articles/updateDataAction', this.getArticle);
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
                console.log(result.data.data.link, result.data);
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