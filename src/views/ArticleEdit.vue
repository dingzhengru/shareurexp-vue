<template>
<div>
    <h1>Article</h1>
    <p>article: {{ getArticle }}</p>
    <form @submit.prevent="editArticle(getArticle)">
        <div class="article">
            <div class="article-head">
                <input type="text" 
                       v-model="getArticle.title">
            </div>
            <div class="article-body">
                <vue-editor 
                    id="editor"
                    useCustomImageHandler
                    @image-added="handleImageAdded"
                    v-model="getArticle.content" 
                ></vue-editor>
            </div>
        </div>
        <button type="submit" class="btn btn-warning">儲存編輯</button>
    </form>
</div>
</template>


<script>

import { db } from '../firebase.js'
import _ from 'lodash'
import axios from "axios";
import { VueEditor } from "vue2-editor";

// 先把store.users以id排序(因users不能刪除，所以id順序能剛好對應)
// users[id] 就會剛好是對應的user

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
            }
        }
    },
    created: function() {

    },
    computed: {
        getArticle: function() {
            let id = this.$route.params.id;
            if(!this.$store.getters['articles/getData'])
                return {}
            return this.$store.getters['articles/getDataById'](id)
        },
        getUserById: (app) => (id) => {
            if(!app.$store.getters['users/getData'])
                return {}
            return app.$store.getters['users/getDataById'](id)
        }
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
        handleImageAdded: function(file, Editor, cursorLocation, resetUploader) {

            let formData = new FormData();
            formData.append("image", file);
            formData.append("user", this.article.creator);

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

<style scoped>



</style>