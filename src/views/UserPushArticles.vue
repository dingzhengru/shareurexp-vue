<template>
<div>
    <div class="d-flex justify-content-center"
         v-if="!getPushArticles || getPushArticles.length <= 0">
        <div class="font-weight-bold">
            無資料
        </div>
    </div>
    <div class="user-articles">
        <!-- {{ this.getCurrentUser.pushArticles }} -->
        <!-- {{ getPushArticles }} -->
        <table class="table table table-hover">
            <thead>
                
            </thead>
            <tbody>
                <tr v-for="(article, index) in getPagePushArticles"
                    :key="index">
                    <td>
                        <router-link :to="{ name: 'article', params: { id: article.id}}">
                            {{ article.title }}
                        </router-link>
                    </td>
                    <td>
                        <i class="fa fa-thumbs-up fa-1x"></i>
                        {{ article.pushs.length }}
                    </td>
                    <td>
                        <i class="fa fa-clock fa-1x"></i>
                        {{ dayjs(article.created.toMillis()).format('YYYY/MM/DD hh:mm') }}
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="d-flex"
             v-if="getPushArticles && getPushArticles.length > 0">
            <div class="pagination mx-auto">
                <Pagination 
                :currentPage="pagination.currentPage"
                :pagesize="pagination.pagesize"
                :data="getPushArticles"
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
        getArticleById: (app) => (id) => {
            return app.$store.getters['articles/getDataById'](id)
        },
        getPushArticles: function() {
            let articleIds = this.getCurrentUser.pushArticles
            return articleIds.map(articleId => this.getArticleById(articleId))
        },
        getPagePushArticles: function() {
            let currentPage = this.pagination.currentPage;
            let pagesize = this.pagination.pagesize;
            let startAt = pagesize * (currentPage - 1);
            let endAt = startAt + pagesize;

            let data = this.getPushArticles || [];

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