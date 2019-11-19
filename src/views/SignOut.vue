
<template>
    <div></div>
</template>

<script>
export default {
    beforeCreate: function() {
        this.$store.dispatch('auth/signOutAction')
        .then(() => {
            console.log('sign out');
            this.$router.push('/');
        })
        .catch((error) => {
            console.log(error);
        })
    }
}
</script>