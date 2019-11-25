<template>
<div>
    <h1>Sign in</h1>
    <form @submit.prevent="signIn(user)">
        email: <input type="text" v-model="user.email"> <br>
        password: <input type="password" v-model="user.password"> <br>
        <button type="submit">登入</button>
        <button type="reset">清空</button>
    </form>
    <p>Auth User: {{ this.$store.getters['auth/getData'] }}</p>
    <p>current user: {{ this.$store.getters['users/getCurrentUser'] }}</p>
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
                this.success = '登入成功: ' + result.user.email;

                // set current user to store.users
                this.$store
                    .dispatch('users/getUserByUid', result.user.uid)
                    .then((data) => {
                        this.$store.commit('users/setCurrentUser', data);
                    })
            })
            .catch((error) => {
                this.error = error
            })
        }
    }
}
</script>