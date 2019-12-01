<template>
<div>
    <div class="user-articles">
        <table class="table table table-hover">
            <thead>
                
            </thead>
            <tbody>
                <tr v-for="(article, index) in getPageArticles"
                    :key="index">
                    <td>
                        <router-link :to="{ name: 'article', params: { id: article.id}}">
                            {{ article.title }}
                        </router-link>
                    </td>
                    <td>{{ article.pushs.length }}</td>
                    <td>{{ dayjs(article.created.toMillis()).format('YYYY/MM/DD hh:mm:ss') }}</td>
                </tr>
            </tbody>
        </table>
        <div class="d-flex">
            <div class="pagination mx-auto">
                <Pagination 
                :currentPage="pagination.currentPage"
                :pagesize="pagination.pagesize"
                :data="getArticles"
                @change-page="changePage">
                </Pagination>
            </div>
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
        getArticles: function() {
            let id = this.$store.getters['users/getCurrentUser'].id
            return this.$store.getters['articles/getArticlesByUserId'](id)
        },
        getArticleById: (app) => (id) => {
            return app.$store.getters['articles/getDataById'](id)
        },
        getPageArticles: function() {
            let currentPage = this.pagination.currentPage;
            let pagesize = this.pagination.pagesize;
            let startAt = pagesize * (currentPage - 1);
            let endAt = startAt + pagesize;

            let data = this.getArticles || [];

            return data.slice(startAt, endAt);
        }
    },
    methods: {
        changePage: function(currentPage) {
            this.pagination.currentPage = currentPage
        },
    }
}
</script>

<style lang="scss" scoped>



</style>