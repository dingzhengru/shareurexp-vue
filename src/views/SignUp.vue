<template>
<div>
    <h1>Sign Up</h1>

    <div class="msg">
        <div class="row">
            <div class="col-12" v-if="success">
                <div class="alert alert-success text-center">
                    {{ success }}
                </div>
            </div>
            <div class="col-12" v-if="error">
                <div class="alert alert-danger text-center">
                    {{ error }}
                </div>
            </div>
        </div>
    </div>

    <form @submit.prevent="signUp(user)">
        username: <input type="text" v-model="user.username"> <br>
        email: <input type="text" v-model="user.email"> <br>
        password: <input type="password" v-model="user.password"> <br>
        <button type="submit">註冊</button>
        <button type="reset">清空</button>
    </form>
    <p>username: {{ user.username }}</p>
    <p>email: {{ user.email }}</p>
    <p>pass: {{ user.password }}</p>
    <p>User: {{ this.$store.getters['auth/getData'] }}</p>
    <p>current user: {{ this.$store.getters['users/getCurrentUser'] }}</p>

</div>
</template>


<script>

import _ from 'lodash'

export default {
    data: function() {
        return {
            user: {
                username: '', 
                email: '',
                password: ''
            },
            error: '',
            message: '',
            success: ''
        }
    },
    beforeCreate: function() {
        // setTimeout(() => {
        //     let auth = this.$store.state.auth.data
        //     if(!_.isEmpty(auth))
        //         this.$router.push('/');
        // }, 100);
    },
    methods: {
        signUp: function(user) {
            this.$store.dispatch('auth/signUpAction', user)
            .then((result) => {
                this.success = '註冊成功'

                // 註冊會自動登入

                // console.log('登入成功:', result.user.email);

                // 刪除密碼，另外創一個users的(自己創的collection)
                // delete user.password;
                // user.uid = result.user.uid;
                // user.pushs = [];
                // user.images = [];
                // user.settings = {
                //     pagesize: 5,
                //     showmode: 'page'
                // }
                // this.$store
                //     .dispatch('users/addDataAction', user)
                //     .then(data => {
                //         this.$store.commit('users/setCurrentUser', data);
                //     })
                // set current user to store.users
                


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
            .catch((error) => {
                console.error(error);
            })
        }
    }
}
</script>