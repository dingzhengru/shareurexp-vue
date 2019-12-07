
<template>
    <div></div>
</template>

<script>
export default {
    created: function() {
        this.$store.dispatch('auth/signOutAction')
        .then(() => {
            this.$store.commit('users/setCurrentUser', null);
            this.$router.replace('/');
        })
        .catch(error => {
            // console.log(error);
        })
    }
}
</script>