<template>
<div>
    <div class="d-flex justify-content-center"
         v-if="!getNotices || getNotices.length <= 0">
        <div class="font-weight-bold">
            無資料
        </div>
    </div>
    <div class="user-notices">
        <table class="table table table-hover">
            <tbody>
                <tr v-for="(noticeId, index) in getPageNotices"
                    :key="index">
                    <td>
                        <span v-if="getNoticeById(noticeId).type == 'official'">
                            <i class="fas fa-bullhorn"></i>
                            官方通知
                        </span>
                        <span v-if="getNoticeById(noticeId).type == 'post'">
                            <i class="fas fa-comments"></i>
                            有新回覆
                        </span>
                    </td>
                    <td>
                        <span v-if="getNoticeById(noticeId).type == 'official'">
                            {{ getNoticeById(noticeId).content }}
                        </span>
                        
                        <span v-if="getNoticeById(noticeId).type == 'post'">
                            <router-link :to="{ name: 'article', params: { id: getNoticeById(noticeId).article}}">
                                {{ getArticleById(getNoticeById(noticeId).article).title }}
                                {{ getNoticeById(noticeId).content }}
                            </router-link>
                        </span>
                    </td>
                    <td>
                        <i class="fa fa-clock fa-1x"></i>
                        {{ dayjs(getNoticeById(noticeId).created.toMillis()).format('YYYY/MM/DD hh:mm') }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="d-flex"
         v-if="getNotices && getNotices.length > 0">
        <div class="pagination mx-auto">
            <Pagination 
            :currentPage="pagination.currentPage"
            :pagesize="pagination.pagesize"
            :data="getNotices"
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
        getNotices: function() {
            return this.getCurrentUser.notices
            // let id = this.$store.getters['users/getCurrentUser'].id
            // return this.$store.getters['notices/getDataByUserId'](id)
        },
        getNoticeById: (app) => (noticeId) => {
            return app.$store.getters['notices/getDataById'](noticeId)
        },
        getArticleById: (app) => (id) => {
            return app.$store.getters['articles/getDataById'](id)
        },
        getPageNotices: function() {
            let currentPage = this.pagination.currentPage;
            let pagesize = this.pagination.pagesize;
            let startAt = pagesize * (currentPage - 1);
            let endAt = startAt + pagesize;

            let data = this.getNotices || [];

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