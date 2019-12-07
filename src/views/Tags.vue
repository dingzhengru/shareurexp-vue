<template>
<div>
    <div class="tags-search">
        <div class="row tags-search-row">
            <div class="col-12">
                <div class="input-group flex-nowrap">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="addon-wrapping">
                            <i class="fas fa-search"></i>
                        </span>
                    </div>
                    <input type="text" 
                           class="form-control" 
                           v-model="search.text"
                           placeholder="搜尋標籤 (點選標籤可以直接搜尋文章)" 
                           aria-describedby="addon-wrapping"
                    />
                </div>
            </div>
            <div class="col"></div>
        </div>
    </div>
    <div class="tags">
        <div class="tag-div">
            <span class="badge badge-success"
                  @click="goArticlesByTag(school.name)"
                  v-for="school in getSchools"
                  :key="school.name">
                {{ school.name }}
                <span class="tag-len">
                    {{ getArticlesBySchoolId(school.id).length }}
                </span>
            </span>
            <span class="badge badge-info"
                  @click="goArticlesByTag(school.name)"
                  v-for="tag in getTags"
                  :key="tag.name">
                {{ tag.name }}
                <span class="tag-len">
                    {{ getArticlesByTagId(tag.id).length }}
                </span>
            </span>
        </div>
    </div>
</div>
</template>


<script>

import { db } from '../firebase.js'


export default {
    data: function() {
        return {
            search: {
                text: '',
                field: 'name'
            }
        }
    },
    created: function() {
        
    },
    computed: {
        getSchools: function() {
            return this.$store.getters['schools/getSearchData'];
        },
        getTags: function() {
            return this.$store.getters['tags/getSearchData'];
        },
        getArticles: function() {
            return this.$store.getters['articles/getData'];
        },
        getArticlesBySchoolId: (app) => (id) => {
            return app.$store.getters['articles/getArticlesBySchoolId'](id);
        },
        getArticlesByTagId: (app) => (id) => {
            return app.$store.getters['articles/getArticlesByTagId'](id);
        }
    },
    methods: {
        goArticlesByTag: function(tagName) {
            this.$router.push({
                name: 'articles',
                query: {searchText: tagName}
            })
        }
    },
    watch: {
        'search.text': function(value) {
            this.$store.commit('schools/setSearch', this.search);
            this.$store.commit('tags/setSearch', this.search);
        }
    }
}
</script>

<style lang="scss" scoped>

.tags-search {
    padding-top: 15px;
    padding-bottom: 15px;
}

.tags {
    .tag-div{
        padding-bottom: 25px;
        

        span {
            font-size: 1.5rem;
            padding-bottom: 10px;
            margin-right: 5px;
            margin-bottom: 10px;
            cursor: pointer;

            &:hover {
                color: black;
            }
        }
        span.tag-len {
            background-color: #E74C3C;
            padding-bottom: 0px;
            padding-right: 3px;
            padding-left: 3px;
            border-radius: 4px;
        }
    }
}
</style>