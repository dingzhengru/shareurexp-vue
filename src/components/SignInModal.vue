<template>
<div :id="id"
     class="modal fade" 
     tabindex="-1" 
     role="dialog" 
     aria-labelledby="mySmallModalLabel" 
     aria-hidden="true">
    <div class="modal-dialog modal-sm">
        <div class="modal-content">
            <div class="modal-header d-felx">
                <div class="mx-auto font-weight-bold">
                    登入
                </div>
            </div>
            <form class="modal-body"
                   @submit.prevent="signIn(user)">
                <div class="d-felx mb-3 text-center"
                     v-if="signInIng">
                    <div class="spinner-border" role="status"></div>
                </div>
                <div class="d-felx mb-3 text-center"
                     v-if="error">
                    <div class="alert alert-danger">
                        {{ error }}
                    </div>
                </div>
                <div class="d-felx mb-3">
                    <div>
                        <input 
                            class="form-control text-center"
                            v-model="user.email"   
                            placeholder="電子信箱"
                            required>
                    </div>
                </div>
                <div class="d-felx mb-3">
                    <div>
                        <input 
                            class="form-control text-center"
                            v-model="user.password"   
                            placeholder="密碼"
                            required>
                    </div>
                </div>
                <div class="d-felx">
                    <button class="btn btn-primary btn-block">
                        送出
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
</template>


<script>
    import $ from 'jquery'
    
    export default {
        name: 'LoginModal',
        props: {
            id: String,
            signInHandle: Function
        },
        data: function() {
            return {
                user: {
                    email: '',
                    password: ''
                },
                error: '',
                signInIng: false,
            }
        },
        methods: {
            signIn: function(user) {
                this.signInIng = true

                this.signInHandle(user)
                .then(data => {
                    this.signInIng = false;
                    $(`#${this.id}`).modal('hide')
                }).catch(error => {
                    this.signInIng = false;

                    console.log(error.code)
                    if(error.code == 'auth/invalid-email')
                        this.error = '信箱格式錯誤'
                    else if(error.code == 'auth/invalid-password')
                        this.error = '密碼錯誤'
                    else if(error.code == 'auth/wrong-password')
                        this.error = '密碼錯誤'
                    else if(error.code == 'auth/user-not-found')
                        this.error = '此信箱未註冊'
                    else 
                        this.error = error.message
                })
            },
            hideModal: function() {
                $(`#${this.id}`).modal('hide')
            }
        }
    }
</script>