<template>
    <div class="pagination-div">
        <nav id="product-pagination" class="pagination-nav">
            <!-- currentPage <= 1 ? 0 : currentPage-- 前者為true會執行的 後者為false會執行的 -->
            <ul class="pagination">
                <li class="page-item"
                    v-bind:class="{ 'disabled': currentPage <= 1 }"
                    @click="prevPage()">
                    <a class="page-link">
                        <i class="fas fa-arrow-left"></i>
                    </a>
                </li>
                <li v-for="(p, index) in totalPage(data)"
                    class="page-item"
                    v-bind:key="p"
                    @click="changePage(index + 1)">
                    <a v-bind:class="{'disabled': currentPage == index + 1}" class="page-link btn" >{{ index + 1 }}</a>
                </li>
                <li class="page-item" 
                    v-bind:class="{ 'disabled': currentPage >= totalPage(data) }"
                    @click="nextPage()">
                    <a class="page-link">
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
    
</template>

<script>
import _ from 'lodash'

export default {
    name: 'Pagination',
    props: {
        currentPage: Number,
        pagesize: Number,
        data: Array
    },
    data: function () {
        return {
            clonePage: _.cloneDeep(this.currentPage)
        }
    },
    methods: {
        totalPage: function(data) {
            // ceil 無條件進位
            if(_.isEmpty(data))
                return 0;
            return Math.ceil(data.length / this.pagesize);
            // return Math.ceil(this.searchProductsByAll(this.searchText).length / this.pagesize);
        },
        prevPage: function() {
            if(this.currentPage <= 1)
                return
            this.$emit('change-page', this.currentPage - 1);
        },
        nextPage: function() {
            if(this.currentPage >= this.totalPage(this.data))
                return
            this.$emit('change-page', this.currentPage + 1);
        }, 
        changePage: function(page) {
            this.$emit('change-page', page);
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pagination-nav a {
    cursor: pointer;
}
</style>
