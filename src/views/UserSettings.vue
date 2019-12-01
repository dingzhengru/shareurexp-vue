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
    <div id="settingsAccordion" class="">
        <div class="card user-settings-card w-50">
            <div class="card-header" id="headingOne">
                <button class="btn btn-link font-weight-bold" data-toggle="collapse" data-target="#settingsArticlesCollapse" aria-expanded="true" aria-controls="settingsArticlesCollapse">
                    文章
                </button>
            </div>
            <div id="settingsArticlesCollapse" class="collapse show" aria-labelledby="headingOne" data-parent="#settingsAccordion">
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
        <div class="card user-settings-card w-50">
            <div class="card-header" id="headingTwo">
                <button class="btn btn-link font-weight-bold" data-toggle="collapse" data-target="#settingsUserCollapse" aria-expanded="true" aria-controls="settingsUserCollapse">
                    帳戶
                </button>
            </div>
            <div id="settingsUserCollapse" class="collapse show" aria-labelledby="headingTwo" data-parent="#settingsAccordion">
                <div class="card-body d-flex">
                    <button class="btn btn-secondary mr-2">
                        變更用戶名
                    </button>
                    <button class="btn btn-warning">
                        更改密碼
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
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
        changeUsername: function() {
            this.$store.dispatch('users/updateDataAction', this.getCurrentUser)
        },
        changePassword: function() {

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

#settingsAccordion {
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
