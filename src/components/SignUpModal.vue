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
                    註冊
                </div>
            </div>
            <form class="modal-body"
                   @submit.prevent="signUp(user)">
                <div class="d-felx mb-3 text-center"
                     v-if="signUpIng">
                    <div class="spinner-border" role="status"></div>
                </div>
                <div class="d-felx mb-3 text-center"
                     v-if="success">
                    <div class="alert alert-success">
                        {{ success }}
                    </div>
                </div>
                <div class="d-felx mb-3 text-center"
                     v-if="message">
                    <div class="alert alert-info">
                        {{ message }}
                    </div>
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
                            v-model="user.username"   
                            placeholder="使用者名稱"
                            required>
                    </div>
                </div>
                <div class="d-felx mb-3">
                    <div>
                        <input 
                            type="text"
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
            signUpHandle: Function
        },
        data: function() {
            return {
                user: {
                    email: '',
                    password: ''
                },
                error: '',
                success: '',
                message: '',
                signUpIng: false,
                closeTimeMS: 5000,
                closeLeftTime: null,
            }
        },
        methods: {
            signUp: function(user) {
                this.signUpIng = true
                this.error = ''
                this.success = ''
                this.message = ''

                this.signUpHandle(user)
                .then(data => {
                    this.signUpIng = false;

                    this.success = `註冊成功，並已發送驗證信件`

                    // 設置每一秒更新一次剩下秒數
                    let count = 0;
                    let countdownTimer = setInterval(() => {

                        count = count + 1000

                        this.closeLeftTime = Math.floor((this.closeTimeMS - count) / 1000);

                        this.message = `${ this.closeLeftTime } 後關閉此視窗`

                        if(this.closeLeftTime <= 0)
                            clearInterval(countdownTimer);
                    }, 1000)

                    // 設置幾秒後關閉
                    setTimeout(() => {
                        $(`#${this.id}`).modal('hide');
                    }, this.closeTimeMS)
                }).catch(error => {
                    this.signUpIng = false;

                    if(error.code == 'auth/invalid-email')
                        this.error = '信箱格式錯誤'
                    else if(error.code == 'auth/email-already-in-use')
                        this.error = '此信箱已註冊'
                    else if(error.code == 'auth/weak-password')
                        this.error = '密碼最少要六個字元'
                    else 
                        this.error = error.message
                })
            },
            hideModal: function() {
                $(`#${this.id}`).modal('hide')
            },
        }
    }
</script>