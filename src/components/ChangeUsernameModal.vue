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
                    更改用戶名
                </div>
            </div>
            <form class="modal-body"
                   @submit.prevent="changeUsername()">
                <div class="d-felx mb-3 text-center"
                     v-if="changeing">
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
                            type="text"
                            class="form-control text-center"
                            v-model="username"   
                            placeholder="使用者名稱"
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
        name: 'ChangeUsernameModal',
        props: {
            id: String,
            changeUsernameHandle: Function
        },
        data: function() {
            return {
                username: '',
                error: '',
                changeing: false,
            }
        },
        methods: {
            changeUsername: function() {
                this.changeUsernameHandle(this.username)
                .then(data => {
                    this.hideModal();
                })
                .catch(error => {
                    this.error = `修改失敗，請重整畫面試試看`
                })
            },
            hideModal: function() {
                $(`#${this.id}`).modal('hide')
            }
        }
    }
</script>