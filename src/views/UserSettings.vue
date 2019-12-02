<template>
<div>
    <div class="row">
        <div class="col-12 text-center font-weight-bold"
             v-if="success">
            <div class="alert alert-success">
                {{ success }}
            </div>
        </div>
        <div class="col-12 text-center font-weight-bold"
             v-if="error">
            <div class="alert alert-danger">
                {{ error }}
            </div>
        </div>
    </div>
    <div id="Accordion" class="">
        <div class="card user-settings-card w-50">
            <div class="card-header">
                <button class="btn btn-link btn-block text-left font-weight-bold" 
                        data-toggle="collapse" 
                        data-target="#ArticlesCollapse" 
                        aria-controls="ArticlesCollapse"
                        aria-expanded="true" >
                    文章
                </button>
            </div>
            <div id="ArticlesCollapse" class="collapse show" >
                <div class="card-body d-flex">
                    <div class="align-self-center align-items-right mr-2">
                        <label for="pagesize">
                            每頁文章數量
                        </label>
                    </div>
                    <div class="align-self-center">
                        <input type="number"
                               id="pagesize"
                               class="form-control inlin-input"
                               min="1"
                               max="50"
                               v-model="getCurrentUser.settings.pagesize">
                    </div>
                </div>
                <div class="card-body d-flex">
                    <div class="align-self-center mr-2">
                        文章顯示模式
                    </div>
                    <div class="page-radio align-self-center mr-3">
                        <div class="custom-control custom-radio">
                            <input type="radio" 
                                   id="customRadio1" 
                                   class="custom-control-input"
                                   v-model="getCurrentUser.settings.showmode" 
                                   value="page">
                            <label class="custom-control-label" for="customRadio1">
                                分頁
                            </label>
                        </div>
                    </div>
                    <div class="scroll-radio align-self-center">
                        <div class="custom-control custom-radio">
                            <input type="radio"
                                   id="scrollRadio" 
                                   class="custom-control-input"
                                   v-model="getCurrentUser.settings.showmode" 
                                   value="scroll">
                            <label class="custom-control-label" for="scrollRadio">
                                滾動
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 文章 -->
        <!-- 帳戶 -->
        <div class="card user-settings-card w-50">
            <div class="card-header">
                <button class="btn btn-link btn-block text-left font-weight-bold"
                        data-toggle="collapse"
                        data-target="#UserCollapse" 
                        aria-controls="UserCollapse"
                        aria-expanded="true" >
                    帳戶
                </button>
            </div>
            <div id="UserCollapse" class="collapse show">
                <div class="card-body d-flex">
                    <button class="btn btn-secondary mr-2"
                            data-toggle="modal"
                            data-target="#ChangeUsernameModal">
                        變更用戶名
                    </button>
                    <button class="btn btn-warning"
                            @click="sendResetPasswordEmail()">
                        更改密碼
                    </button>
                </div>
            </div>
        </div>
        <!-- 帳戶 -->
        <!-- 通知 -->
        <div class="card user-settings-card w-50">
            <div class="card-header">
                <button class="btn btn-link btn-block text-left font-weight-bold"
                        data-toggle="collapse"
                        data-target="#NoticeCollapse" 
                        aria-controls="NoticeCollapse"
                        aria-expanded="true" >
                    通知
                </button>
            </div>
            <div id="NoticeCollapse" class="collapse show">
                <div class="card-body d-flex">
                    <div>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Modal -->
    <ChangeUsernameModal
        id="ChangeUsernameModal"
        :changeUsernameHandle="changeUsername">
        
    </ChangeUsernameModal>
</div>
</template>

<script>

import ChangeUsernameModal from '../components/ChangeUsernameModal.vue'

export default {
    components: {
        ChangeUsernameModal
    },
    data: function() {
        return {
            success: '',
            error: ''
        }
    },
    created: function() {
        
    },
    computed: {
        getCurrentUser: function() {
            return this.$store.getters['users/getCurrentUser'];
        },
    },
    methods: {
        changeUsername: function(username) {
            this.getCurrentUser.username = username
            return new Promise((resolve, reject) => {
                this.$store.dispatch('users/updateDataAction', this.getCurrentUser)
                .then(data => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
            })
        },
        sendResetPasswordEmail: function() {
            this.$store.dispatch('auth/sendPasswordResetEmail', this.getCurrentUser)
            .then(data => {
                this.success = `已送出重置密碼的信件`
            })
            .catch(error => {
                console.log(error)
                this.error = error
            })
        }
    },
    watch: {
        'getCurrentUser.settings.pagesize': function(value, oldValue) {
            if(value < 1 || value > 50) {
                this.error = `文章數量: 不可低於 1 或高於 50`
            } else {
                this.success = `文章數量: ${ value }`
                this.$store.dispatch('users/updateDataAction', this.getCurrentUser)
            }
        }, 
        'getCurrentUser.settings.showmode': function(value, oldValue) {
            let showVal = value == 'page' ? '分頁' : '滾動'

            this.success = `顯示模式:  ${ showVal }`
            this.$store.dispatch('users/updateDataAction', this.getCurrentUser)
        }, 
    }
}
</script>

<style lang="scss" scoped>

#Accordion {
    .card-header {
        padding: 0px;

        button {
            // color: #1d525f;
        }
    }
    .page-radio {
        input {
            cursor: pointer;
        }
        label {
            cursor: pointer;
        }
    }
    .scroll-radio {
        input {
            cursor: pointer;
        }
        label {
            cursor: pointer;
        }
    }
}

</style>
