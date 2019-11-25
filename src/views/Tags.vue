<template>
<div>
    <div class="tags-search">
        <div class="row tags-search-row">
            <div class="col-8">
                <div class="input-group flex-nowrap">
                    <div class="input-group-prepend">
                        <span class="input-group-text" id="addon-wrapping">
                            <i class="fas fa-search"></i>
                        </span>
                    </div>
                    <input type="text" 
                           class="form-control" 
                           v-model="search.text"
                           placeholder="搜尋標籤" 
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
            </span>
            <span class="badge badge-info"
                  @click="goArticlesByTag(school.name)"
                  v-for="tag in getTags"
                  :key="tag.name">
                {{ tag.name }}
            </span>
        </div>
    </div>
</div>
</template>


<script>

import { db } from '../firebase.js'

// 先把store.users以id排序(因users不能刪除，所以id順序能剛好對應)
// users[id] 就會剛好是對應的user


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
        }
    }
}
</style>