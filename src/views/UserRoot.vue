<template>
    <div>
        <div class="row user-profile mb-5">
            <div class="col-2 text-center">
                <span class="avatar" style="background-color: red;">
                    {{ getCurrentUser.username.substring(0 ,1) }}
                </span>
            </div>
            <div class="col-10">
                <div class="username mb-4">{{ getCurrentUser.username }}</div>
                <div>
                    <span class="user-id mr-3">
                        ID：{{ getCurrentUser.id }}
                    </span>
                    <span class="user-email mr-3">
                        <i class="fas fa-envelope"></i>
                        {{ getCurrentUser.email }}
                        <span v-if="!getEmailVerified">
                            (未驗證) 
                            <button class="btn btn-warning btn-sm mr-1"
                                    @click="sendEmailVerification()">
                                驗證
                            </button>
                            <span class="alert alert-success"
                                  v-if="emailMsg">
                                {{ emailMsg }}
                            </span>
                            <span class="alert alert-danger"
                                  v-if="emailError">
                                {{ emailError }}
                            </span>
                        </span>
                        
                    </span>
                    <span class="user-created">
                        <i class="fas fa-user-plus"></i>
                        {{ dayjs(getCurrentUser.created.toMillis()).format('YYYY/MM/DD') }}
                    </span>
                </div>
                <div>
                    <span class="mr-3">
                        
                    </span>
                </div>
            </div>
        </div>
        <div class= "row">
            <div class="col-2">
                <nav class="user-sidebar nav flex-column nav-pills">
                    <router-link 
                        class="nav-link"
                        :to="{ name: 'user' }">
                        <i class="fas fa-newspaper"></i> 
                        發文
                    </router-link>
                    <router-link 
                        class="nav-link"
                        :to="{ name: 'user-posts' }">
                        <i class="fas fa-comment-dots"></i> 
                        回覆
                    </router-link>
                    <router-link 
                        class="nav-link"
                        :to="{ name: 'user-push-articles' }">
                        <i class="fas fa-thumbs-up"></i> 
                        推文
                    </router-link>
                    <router-link 
                        class="nav-link"
                        :to="{ name: 'user-notices' }">
                        <i class="fas fa-bell"></i> 
                        通知
                    </router-link>
                    <router-link 
                        class="nav-link"
                        :to="{ name: 'user-settings' }">
                        <i class="fas fa-cog"></i> 
                        設定
                    </router-link>
                </nav>
            </div>
            <div class="col-10">
                <router-view/>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
    data: function() {
        return {
            dayjs: dayjs,
            emailMsg: '',
            emailError: ''
        }
    },
    created: function() {
        
    },
    computed: {
        getCurrentUser: function() {
            return this.$store.getters['users/getCurrentUser'];
        },
        getAuthUser: function() {
            return this.$store.getters['auth/getCurrentUser'];
        },
        getEmailVerified: function() {
            return this.$store.getters['auth/getEmailVerified']
        }
    },
    methods: {
        sendEmailVerification: function() {
            let user = this.getAuthUser
            this.emailMsg = ''
            this.emailError = ''
            
            this.$store.dispatch('auth/sendEmailVerification', user)
            .then(() => {
                this.emailMsg = '已發送'
            })
            .catch((error) => {
                if(error.code == 'auth/too-many-requests')
                    this.emailError = '才剛送過一封，請稍號再試'
            })
        }
    }
}
</script>

<style lang="scss" scoped>

$sidebar-text-color: #1d525f;

.user-profile {
    margin-top: -10px;
    padding-top: 10px;
    padding-bottom: 10px;
    // background-color: rgb(160, 229, 173);
    background-color: #CFD7C8;
    .username {
        font-size: 1.5rem;
        font-weight: bold;
    }
    .user-id {

    }
    .user-email {
        .alert {
            padding: 8px;
            font-size: 0.8rem;
        }
    }
    .user-created {

    }
    .avatar {
        display: inline-block;
        box-sizing: content-box;
        color: #fff;
        text-align: center;
        vertical-align: top;
        background-color: #e5ecf5;
        font-weight: 400;
        line-height: 96px;
        font-size: 48px;
        width: 96px;
        height: 96px;
        border-radius: 96px;
    }
}


.user-sidebar {

    .nav-link {
        margin-bottom: 5px;
        font-size: 0.9rem;
        color: $sidebar-text-color;
    }
    .nav-link:hover {
        background-color: #007bff !important;
        color: white;
    }
    a.router-link-exact-active {
        background-color: #007bff;
        color: white;
    }
}

</style>
