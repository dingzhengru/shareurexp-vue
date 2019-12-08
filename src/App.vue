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

        <!-- Left -->

        <ul class="navbar-nav">
            <li class="nav-item active">
                <router-link class="nav-link" to="/articles">文章</router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-link" to="/tags">標籤</router-link>
            </li>
        </ul>

        <!-- Center -->
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
                    <input type="search" 
                       class="form-control" 
                       v-model="articlesSearch.text"
                       placeholder="搜尋文章"
                       :style="{ width: inputWidth }" 
                       @focus="widenInputWidth()"
                       @blur="narrowInputWidth()"
                       required>
                <div class="input-group-append">
                    <button type="submit" class="input-group-text" id="articles-search-button">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>

        </form>

        <!-- Right -->

        <ul class="navbar-nav ml-auto"
            v-show="getIsCurrentUserReady">
            <!-- 未登入顯示 -->
            <li class="nav-item"
                v-show="!getCurrentUser">
                <a href=""
                   class="nav-link"
                   data-toggle="modal"
                   data-target="#SignUpModal">
                   註冊
                </a>
            </li>
            <li class="nav-item"
                v-show="!getCurrentUser">
                <a href=""
                   class="nav-link"
                   data-toggle="modal"
                   data-target="#SignInModal">
                   登入
                </a>
            </li>
            <!-- 登入後顯示 -->
            <li class="nav-item post-add-link"
                v-if="this.getCurrentUser && this.$route.name == 'article'">
                <router-link 
                    class="nav-link"
                    :to="{ name: 'post-add',
                           params: { id: this.$route.params.id }}">
                    <i class="fas fa-comment-dots"></i>
                </router-link>
            </li>
            <li class="nav-item"
                v-show="getCurrentUser && this.$route.name != 'article'">
                <router-link class="nav-link" to="/articles/add">
                    <i class="fas fa-edit"></i>
                </router-link>
            </li>

            <!-- Dropdown -->

            <li class="notice-dropdown nav-item dropdown" 
                v-if="getCurrentUser"
                @click="readNotices()"
                ref="notices">
                <a class="nav-link" href="" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-bell"></i>
                    <span class="notice-inner-counter"
                          v-if="getNotReadNotices && getNotReadNotices.length > 0">
                        {{ getNotReadNotices.length }}
                    </span>
                </a>
                <div class="notice-menu dropdown-menu dropdown-menu-right">
                    <div class="notice-header d-flex">
                        通知
                    </div>
                    <div class="notice-content"
                         v-for="(noticeId, index) in getFilterNotices"
                         :key="index"
                         :style="!isReadNotice(noticeId) ? { 'background-color': '#F7DC6F' } : {}">
                        <div class="notice-official d-flex"
                             v-if="getNoticeById(noticeId).type == 'official'">
                            <div class="notice-message">
                                <i class="fas fa-bullhorn"></i>
                                官方通知: {{ getNoticeById(noticeId).content }}
                            </div>
                        </div>
                        <div class="notice-post d-flex"
                             v-if="getNoticeById(noticeId).type == 'post'"
                             @click="goArticle(getNoticeById(noticeId).article)">
                            <div class="notice-message">
                                <i class="fas fa-comments"></i>
                                {{ getArticleById(getNoticeById(noticeId).article).title }}
                                {{ getNoticeById(noticeId).content }}
                            </div>
                        </div>
                    </div>
                </div>
            </li>

            <li class="nav-item dropdown user-dropdown" v-if="getCurrentUser">
                <a class="nav-link" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="avatar small-avatar" 
                          :style="{ background: getCurrentUser.avatarColor }">
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
                        :to="{ name: 'user-notices' }">
                    <i class="fas fa-bell"></i>
                    所有通知</router-link>
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
                    <i class="fas fa-sign-out-alt"></i>
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
            notices: {
                size: 10,
                readWait: 3000,
            }
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
            return this.$store.getters['users/getCurrentUser'];
        },
        getIsCurrentUserReady: function() {
            return this.$store.getters['users/getIsCurrentUserReady'];
        },
        getArticleById: (app) => (id) => {
            return app.$store.getters['articles/getDataById'](id)
        },
        getNotices: function() {
            return this.getCurrentUser.notices
        },
        getNoticeById: (app) => (noticeId) => {
            return app.$store.getters['notices/getDataById'](noticeId)
        },
        isReadNotice: (app) => (noticeId) => {
            let readUsers = app.getNoticeById(noticeId).readUsers
            let userId = app.getCurrentUser.id
            return readUsers.indexOf(userId) >= 0
        },
        getNotReadNotices: function() {
            let userId = this.getCurrentUser.id
            let notices = this.getNotices
            return notices.filter(noticeId => !this.isReadNotice(noticeId))
        },
        getFilterNotices: function() {
            let notices = this.getNotices
            let size = this.notices.size
            return notices.slice(0, size)
        },
    },
    methods: {
        goArticles: function(search) {
            this.$router.push({
                name: 'articles',
                params: { searchText: search.text }
            })
        },
        goArticle: function(id) {
            this.$router.push({
                name: 'article',
                params: { id: id }
            })
        },
        readNotices: function() {
            let userId = this.getCurrentUser.id
            let notices = this.getCurrentUser.notices
            notices.forEach(noticeId => {
                let notice = this.getNoticeById(noticeId)

                // 已經讀過的 就直接跳過
                if(this.isReadNotice(noticeId))
                    return

                setTimeout(() => {
                    notice.readUsers.push(userId)
                    this.$store.dispatch('notices/updateDataAction', notice)
                }, this.notices.readWait)
            })
        },
        widenInputWidth: function() {
            this.inputWidth = '300px';
        },
        narrowInputWidth: function() {
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
                .then(result => {
                    // 註冊會自動登入

                    // 刪除密碼，另外創一個users的(自己創的collection)
                    delete user.password;
                    user.uid = result.user.uid;

                    // set current user to store.users
                    this.$store
                        .dispatch('users/addDataAction', user)
                        .then(data => {
                            this.$store.commit('users/setCurrentUser', data);
                            resolve(data)
                        })
                        

                    // send Email
                    this.$store.dispatch('auth/sendEmailVerification', result.user)
                    .then(() => {
                        // this.message = '已發送驗證信件，請至信箱驗證'
                    })
                    .catch((error) => {
                        reject(error)
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
        &.notice-dropdown {
            .nav-link {
                .notice-inner-counter {
                    color: white;
                    background-color: #E74C3C;
                    font-size: 0.5rem;
                    border-radius: 8px;
                    text-align: center;
                    padding-left: 1px;
                    padding-right: 5px;
                    padding-top: 5px;
                    padding-bottom: 5px;
                }
            }
            .notice-menu {
                padding: 0px;
                min-width: 400px;
                font-weight: bold;

                height: auto;
                max-height: 300px;
                overflow-x: hidden;
                .notice-header {
                    border-bottom: 2px solid #1b2028;
                    font-size: 0.8rem;
                    padding-top: 5px;
                    padding-bottom: 5px;
                    padding-left: 5px;
                    
                    background-color: #E5E7E9;
                }
                .notice-content {
                    border-bottom: 2px solid #1b2028;
                    font-size: 0.8rem;
                    padding-top: 5px;
                    padding-bottom: 5px;
                    padding-left: 5px;
                    
                    &:last-child {
                        border-bottom: 0px;
                    }
                    &:hover {
                        background-color: #99A3A4;

                    }

                    .notice-official {
                        
                    }
                    
                    .notice-post {
                        cursor: pointer;
                        color: blue;

                        &:hover {
                            color: $nav-text-hover-color;
                        }
                    }
                }
            }
        }
        &.user-dropdown {
            .nav-link {
                
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
