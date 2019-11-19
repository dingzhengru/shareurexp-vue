<template>
<div>
    <h1>Sign Up</h1>
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
    User: {{ this.$store.getters['auth/getData'] }}
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
        setTimeout(() => {
            let auth = this.$store.state.auth.data
            if(!_.isEmpty(auth))
                this.$router.push('/');
        }, 1000);
    },
    methods: {
        signUp: function(user) {
            this.$store.dispatch('auth/signUpAction', user)
            .then((result) => {
                console.log('signUp:', result.user.email);
                this.success = '註冊成功'

                // 另外創一個users的(自己創的collection)
                delete user.password;
                user.uid = result.user.uid;
                user.email = result.user.email;
                user.created = new Date(Date.now());
                this.$store.dispatch('users/addDataAction', user)

                // Sign in
                // this.$store.dispatch('auth/signInAction', user)
                // .then((result) => {

                //     console.log('登入成功:', result.user.email);

                //     // send Email
                //     this.$store.dispatch('auth/sendEmailVerification', result.user)
                //     .then(() => {
                //         console.log('send email:', result.user.email);
                //         this.message = '已發送驗證信件，請至信箱驗證'
                //     })
                //     .catch((error) => {
                //         console.log(error);
                //     })
                // })
            })
            .catch((error) => {
                this.error = error;
                console.error(error);
            })
        }
    }
}
</script>