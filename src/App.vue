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
        <i class="fas fa-align-justify
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
                    <input type="text" 
                       class="form-control" 
                       v-model="articlesSearch.text"
                       placeholder="搜尋文章"
                       :style="{ width: inputWidth }" 
                       @focus="widenInputWidth()"
                       @blur="narrowInputWidth()"
                       required>
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
            <li class="nav-item post-add-link"
                v-if="this.$route.name == 'article'">
                <router-link 
                    class="nav-link"
                    :to="{ name: 'post-add',
                           params: { id: this.$route.params.id }}">
                    <i class="fas fa-comment-dots"></i>
                </router-link>
            </li>
            <li class="nav-item"
                v-if="this.$route.name != 'article' && getCurrentUser">
                <router-link class="nav-link" to="/articles/add">
                    <i class="fas fa-edit"></i>
                </router-link>
            </li>
            <li class="nav-item"
                v-if="!getCurrentUser">
                <a href="#"
                   class="nav-link"
                   data-toggle="modal"
                   data-target="#SignUpModal">
                   註冊
                </a>
            </li>
            <li class="nav-item"
                v-if="!getCurrentUser">
                <a href="#"
                   class="nav-link"
                   data-toggle="modal"
                   data-target="#SignInModal">
                   登入
                </a>
            </li>
            <li class="nav-item dropdown" v-if="getCurrentUser">
                <a class="nav-link" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="avatar small-avatar" 
                          style="background: rgb(160, 229, 173);">
                        {{ getCurrentUser.username.substring(0, 1) }}
                    </span>
                    <span>{{ getCurrentUser.username }}</span>
                </a>
                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                    <router-link 
                        class="dropdown-item" 
                        v-if="true"
                        :to="{ name: 'user' }">
                    <i class="fas fa-user"></i>
                    基本資料</router-link>
                    <router-link 
                        class="dropdown-item" 
                        v-if="true"
                        :to="{ name: 'user-settings' }">
                    <i class="fas fa-cog"></i>
                    個人設定</router-link>
                    <div class="dropdown-divider"></div>
                    <router-link 
                        class="dropdown-item" 
                        v-if="true"
                        to="/sign-out">
                    <i class="fas sign-out-alt"></i>
                    登出</router-link>
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



<!-- Modal -->
<SignInModal
    id="SignInModal"
    :signInHandle="signIn">    
</SignInModal>

<SignUpModal
    id="SignUpModal"
    :signUpHandle="signUp">
    
</SignUpModal>

<!-- Modal -->

</div>
</template>

<script>

import SignInModal from './components/SignInModal.vue'
import SignUpModal from './components/SignUpModal.vue'

export default {
    components: {
        SignInModal,
        SignUpModal
    },
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
        },
        getCurrentUser: function() {
            console.log(this.$store.getters['users/getCurrentUser'])
            return this.$store.getters['users/getCurrentUser'];
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
        },
        signIn: function(user) {
            return new Promise((resolve, reject) => {
                this.$store.dispatch('auth/signInAction', user)
                .then(result => {
                    this.success = '登入成功: ' + result.user.email;

                    // set current user to store.users
                    this.$store
                        .dispatch('users/getUserByUid', result.user.uid)
                        .then(data => {
                            this.$store.commit('users/setCurrentUser', data);
                            resolve(data);
                        })
                })
                .catch(error => {
                    reject(error)
                })
            })
        },
        signUp: function(user) {
            return new Promise ((resolve, reject) => {
                this.$store.dispatch('auth/signUpAction', user)
                .then((result) => {

                    // Sign in
                    this.$store.dispatch('auth/signInAction', user)
                    .then((result) => {

                        console.log('登入成功:', result.user.email);

                        // 刪除密碼，另外創一個users的(自己創的collection)
                        delete user.password;
                        user.uid = result.user.uid;
                        user.pushs = [];
                        user.images = [];
                        user.settings = {
                            pagesize: 5,
                            showmode: 'page'
                        }
                        // set current user to store.users
                        this.$store
                            .dispatch('users/addDataAction', user)
                            .then(data => {
                                this.$store.commit('users/setCurrentUser', data);
                                resolve(data)
                            })
                        

                        // send Email
                        // this.$store.dispatch('auth/sendEmailVerification', result.user)
                        // .then(() => {
                        //     console.log('send email:', result.user.email);
                        //     this.message = '已發送驗證信件，請至信箱驗證'
                        // })
                        // .catch((error) => {
                        //     console.log(error);
                        // })
                    })
                })
                .catch((error) => {
                    reject(error)
                })
            })
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

$nav-text-color: #1d525f;
$nav-text-hover-color: #FAF0E6;

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
            color: $nav-text-color;
            font-weight: bold;
            text-align: center;
        }
        a:hover { color: $nav-text-hover-color; }
        a.router-link-exact-active {
            color: $nav-text-hover-color;
        }
        &.post-add-link {
            margin-right: 10px;
        }
        &.back-link {
            margin-top: 7px;
            margin-right: 10px;
        }
        &.dropdown {
            .nav-link {
                font-size: 1rem;
            }
            .dropdown-menu {

            }
            a.dropdown-item:hover {
                background-color: $nav-text-color;
            }
            a.dropdown-item.router-link-exact-active {
                background-color: $nav-text-color;
            }
        }
    }
    button.navbar-toggler {
        // color: $nav-text-color;
        .navbar-collapse-icon:hover {
            color: #FAF0E6;
        }
    }
    .avatar {
        display: inline-block;
        box-sizing: content-box;
        color: #fff;
        text-align: center;
        vertical-align: top;
        background-color: #e5ecf5;
        font-weight: 400;
        width: 48px;
        height: 48px;
        border-radius: 48px;
        font-size: 24px;
        line-height: 48px;
    }
    .small-avatar {
        margin: -2px 5px -2px -6px !important;
        width: 24px  !important;
        height: 24px  !important;
        border-radius: 24px  !important;
        font-size: 12px  !important;
        line-height: 24px  !important;
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
