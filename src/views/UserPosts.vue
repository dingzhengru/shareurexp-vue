<template>
<div>
    <div class="d-flex justify-content-center"
         v-if="!getPosts || getPosts.length <= 0">
        <div class="font-weight-bold">
            無資料
        </div>
    </div>
    <div class="user-posts">
        <table class="table table table-hover">
            <thead>
                
            </thead>
            <tbody>
                <tr v-for="(post, index) in getPagePosts"
                    :key="index">
                    <td>
                        <router-link :to="{ name: 'article', params: { id: post.article}}">
                            {{ getArticleById(post.article).title }}
                        </router-link>
                    </td>
                    <td>
                        <i class="fa fa-thumbs-up fa-1x"></i>
                        {{ post.pushs.length }}
                    </td>
                    <td>
                        <i class="fa fa-clock fa-1x"></i>
                        {{ dayjs(post.created.toMillis()).format('YYYY/MM/DD hh:mm') }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="d-flex"
         v-if="getPosts && getPosts.length > 0">
        <div class="pagination mx-auto">
            <Pagination 
            :currentPage="pagination.currentPage"
            :pagesize="pagination.pagesize"
            :data="getPosts"
            @change-page="changePage">
            </Pagination>
        </div>
    </div>
</div>
</template>


<script>

import { db } from '../firebase.js'
import _ from 'lodash'
import dayjs from 'dayjs'
import Pagination from '../components/Pagination.vue'

export default {
    components: {
        Pagination
    },
    data: function() {
        return {
            dayjs: dayjs,
            pagination :{
                currentPage: 1,
                pagesize: 5
            },
        }
    },
    created: function() {

    },
    computed: {
        getCurrentUser: function() {
            return this.$store.getters['users/getCurrentUser'];
        },
        getPosts: function() {
            let id = this.$store.getters['users/getCurrentUser'].id
            return this.$store.getters['posts/getPostsByUserId'](id)
        },
        getArticleById: (app) => (id) => {
            return app.$store.getters['articles/getDataById'](id)
        },
        getPagePosts: function() {
            let currentPage = this.pagination.currentPage;
            let pagesize = this.pagination.pagesize;
            let startAt = pagesize * (currentPage - 1);
            let endAt = startAt + pagesize;

            let data = this.getPosts || [];

            return data.slice(startAt, endAt);
        }
    },
    methods: {
        changePage: function(currentPage) {
            this.pagination.currentPage = currentPage
        }
    }
}
</script>

<style lang="scss" scoped>


</style>