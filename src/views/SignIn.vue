<template>
<div>
    <h1>Sign in</h1>
    <form @submit.prevent="signIn(user)">
        email: <input type="text" v-model="user.email"> <br>
        password: <input type="password" v-model="user.password"> <br>
        <button type="submit">登入</button>
        <button type="reset">清空</button>
    </form>
    <p>email: {{ user.email }}</p>
    <p>pass: {{ user.password }}</p>
    User: {{ this.$store.getters['auth/getData'] }}
</div>
</template>


<script>

export default {
    data: () => {
        return {
            user: {
                email: '',
                password: '',
            }
        }
    }, 
    methods: {
        signIn: function(user) {
            this.$store.dispatch('auth/signInAction', user)
            .then((result) => {
                this.success = '登入成功: ' + result.user.displayName;
            })
            .catch((error) => {
                this.error = error
            })
        }
    }
}
</script>