<template>
  <div class="container">
    <div>
      <h1>Page not Found.</h1>
      <h3>Redirecting to Sign In Page...</h3>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    setTimeout(() => {
      this.$router.push({ name: 'LogIn' });
    }, 5000);
  }
};
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  place-items: center;
  text-align: center;
}

h1 {
  font-size: 6rem;
  font-weight: 300;
}

h3 {
  margin-top: 1em;
}
</style>
