
<template>
    <div></div>
</template>

<script>
export default {
    beforeCreate: function() {
        this.$store.dispatch('auth/signOutAction')
        .then(() => {
            this.$store.commit('users/setCurrentUser', null);
            this.$router.push('/');
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
</script>