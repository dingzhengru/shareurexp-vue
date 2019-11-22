<template>
<div>
    <h1>New Article</h1>
    {{ article }}
    <form @submit.prevent="addArticle(article)">
        <div>
            <input v-model="article.title">
        </div>
        <div>
            <vue-editor 
                id="editor"
                useCustomImageHandler
                @image-added="handleImageAdded"
                v-model="article.content" 
            ></vue-editor>
        </div>
        <button type="submit" class="btn btn-primary">送出</button>
    </form>
</div>
</template>


<script>

import { db } from '../firebase.js';
import _ from 'lodash';
import axios from 'axios';
import { VueEditor } from 'vue2-editor';
import imgurClient from '../imgur-api.js'

export default {
    components: { 
        VueEditor 
    },
    data: function() {
        return {
            article: {
                id: null,
                title: '',
                content: '',
                creator: null,
                posts: [],
                created: '',
                editDate: '',
            },

        }
    },
    beforeCreate: function() {
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
                this.article.creator = data.id;
                clearInterval(userTimer)
            })
        }, 500)
    },
    computed: {

    },
    methods: {
        addArticle: function(article) {
            this.$store.dispatch('articles/addDataAction', article)
            .then((data) => {
                console.log('add article success')
                this.$router.push({
                    name: 'article',
                    params: { id: data.id }
                })
            })
            .catch((error) => {
                console.log(error);
            })
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
                let user = this.$store.getters['users/getDataById'](this.article.creator);
                user.images.push(url);
                this.$store.dispatch('users/updateDataAction', user);

                Editor.insertEmbed(cursorLocation, "image", url);
                resetUploader();
            })

            // my express server
            // axios({
            //     url: 'http://localhost:3000/upload-image',
            //     method: 'POST',
            //     data: formData,
            // }).then(result => {
            //     console.log(result.data);
            //     let url = result.data; // Get url from response
            //     Editor.insertEmbed(cursorLocation, "image", url);
            //     resetUploader();
            // })
            // .catch(err => {
            //     console.log(err);
            // });
        }
    }
}
</script>

<style scoped>

.article-editor-div {
    margin-left: 50px;
    width: 800px;
}

</style>