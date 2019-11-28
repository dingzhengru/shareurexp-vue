<template>
<div id="app">

<nav id="navbar" class="navbar navbar-expand-sm navbar-custom">
    <router-link to="/" class="navbar-brand">
        <img src="https://i.imgur.com/qz3f7tJ.png"
             height="50"
             width="100"
             alt="logo"
             title="home">
    </router-link>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
        <i class="fas fa-align-justify fa-2x
                  navbar-collapse-icon"></i>
    </button>
    <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav">
            <li class="nav-item active">
                <router-link class="nav-link" to="/articles">文章</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" to="/tags">標籤</router-link>
            </li>
        </ul>
        <form class="form-inline articles-search"
              @submit.prevent="goArticles(articlesSearch)">
            <div class="input-group">
                <div class="input-group-prepend">
                    <select class="form-control select-custom"
                            v-model="articlesSearch.field">
                        <option value="">全部</option>
                        <option value="title">標題</option>
                        <option value="tags">標籤</option>
                        <option value="creator">作者</option>
                        <option value="content">內容</option>
                    </select>
                </div>
                <!-- <input type="text" 
                       class="form-control" 
                       v-model="articlesSearch.text"
                       placeholder="搜尋文章" > -->
                    <input type="text" 
                       class="form-control" 
                       v-model="articlesSearch.text"
                       placeholder="搜尋文章"
                       :style="{ width: inputWidth }" 
                       @focus="widenInputWidth()"
                       @blur="narrowInputWidth()">
                <i class="searchclear fas fa-times-circle"
                   @click="articlesSearch.text=''"
                   v-if="articlesSearch.text"></i>
                <div class="input-group-append">
                    <button type="submit" class="input-group-text" id="articles-search-button">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
        </form>
        <ul class="navbar-nav ml-auto">
            <!-- <li class="nav-item back-link">
                <a href="#" @click="$router.go(-1)">
                    <i class="fas fa-arrow-circle-left fa-2x"></i>
                </a>
            </li> -->
            <li class="nav-item">
                <router-link class="nav-link" to="/user">
                    <i class="fas fa-user"></i>
                </router-link>
            </li>
            <li class="nav-item post-add-link"
                v-if="this.$route.name == 'article'">
                <router-link 
                    class="nav-link"
                    :to="{ name: 'post-add',
                           params: { id: this.$route.params.id }}">
                    <i class="fas fa-comment-dots fa-2x"></i>
                </router-link>
            </li>
            <li class="nav-item"
                v-if="this.$route.name != 'article'">
                <router-link class="nav-link" to="/articles/add">
                    <i class="fas fa-edit"></i>
                </router-link>
            </li>
            <li class="nav-item"
                v-if="true">
                <router-link class="nav-link" to="/sign-up">
                    <i class="fas fa-user-plus"></i>
                </router-link>
            </li>
            <li class="nav-item"
                v-if="true">
                <router-link class="nav-link" to="/sign-in">
                    登入
                </router-link>
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-align-justify
                              navbar-toggle-icon"></i>
                </a>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                    <router-link 
                        v-if="true"
                        class="dropdown-item" 
                        to="/sign-out">
                    Sign Out</router-link>
                </div>
            </li>
        </ul>
    </div>
</nav>

<main class="container">

    <router-view/>
</main>

<footer>
    <div class="container">
        <div class="row">
            <div class="col text-center">
                <a href="https://github.com/dingzhengru">Github</a>
            </div>
        </div>
        <div class="row">
            <div class="col text-center">
                聯絡我: <a href="mailto://qws7869vdx@gmail.com">qws7869vdx@gmail.com</a>
            </div>
        </div>
        <div class="row">
            <div class="col text-center">
                Copyright © 2019 DingZhengRu
            </div>
        </div>
    </div>
</footer>

</div>
</template>

<script>
export default {
    data: function() {
        return {
            articlesSearch: {
                text: '',
                field: ''
            },
            inputWidth: '100px',
        }
    },
    created: function() {
        
    },
    computed: {
        authIsReady: function() {
            return this.$store.getters['auth/getIsReady'];
        },
        authIsSignIn: function() {
            return this.$store.getters['auth/getIsSignIn'];
        }
    },
    methods: {
        goArticles: function(search) {
            this.$router.push({
                name: 'articles',
                params: { searchText: search.text }
            })
        },
        widenInputWidth: function() {
            console.log('focus');
            this.inputWidth = '300px';
        },
        narrowInputWidth: function() {
            console.log('blur');
            this.inputWidth = '100px';
        }
    },
    watch: {
        'articlesSearch.text': function(value) {
            this.$store.commit('articles/setSearchText', this.articlesSearch.text);
        }, 
        'articlesSearch.field': function(value) {
            this.$store.commit('articles/setSearchField', this.articlesSearch.field);
        }
    }
}
</script>

<style lang="scss">
html, body, #app{
    height: 100%;
    font-family: system,BlinkMacSystemFont,system latin,system emoji,system tc,sans-serif;
}

#app {
    
}
// nav
.navbar-custom {

    background-color: #CCBF97; 
    
    &.navbar {
        padding: 0;
    }
    form.articles-search {
        margin: auto;

        input {
            transition: width 0.3s ease-in-out;
        }
        select.select-custom {
            border-radius: 0.25rem 0rem 0rem 0.25rem;
        }
        select.select-custom:focus {
            border-color: none;
            box-shadow: none;
        }
        .searchclear {
            position: absolute;
            right: 50px;
            top: 0;
            bottom: 0;
            height: 14px;
            margin: auto;
            font-size: 14px;
            cursor: pointer;
            color: #ccc;
            z-index: 99;
        }
    }
    .nav-item {
        a {
            color: #1d525f;
            font-size: 1.2rem;
            font-weight: bold;
            text-align: center;
        }
        a:hover { color: #FAF0E6; }
        a.router-link-exact-active {
            color: #FAF0E6;
        }
        a.dropdown-item:hover {
            background-color: #1d525f;
        }
        a.dropdown-item.router-link-exact-active {
            background-color: #1d525f;
        }
        &.post-add-link {
            margin-right: 10px;
        }
        &.back-link {
            margin-top: 7px;
            margin-right: 10px;
        }
    }
    button.navbar-toggler {
        color: #1d525f;
        .navbar-collapse-icon:hover {
            color: #FAF0E6;
        }
    }
}

// main
main.container {
    box-shadow: 0px 0px 10px 3px #888888; 
    position: relative;
    min-height: 100%;
    padding-top: 10px;
    padding-bottom: 20px;
}

// footer
footer {
    background-color: #135A77;
    height: 70px;
    clear: both;
    font-size: 0.5rem;
    a { color: #FAF0E6; }
    a:hover { color: #C7B19C;  }
}

</style>
