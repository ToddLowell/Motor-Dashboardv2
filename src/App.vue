<template>
  <div id="app">
    <bg-switcher />
    <router-view />
  </div>
</template>

<script>
import BgSwitcher from './components/BgSwitcher.vue';

export default {
  components: {
    BgSwitcher
  },
  async created() {
    await this.$store.dispatch('autoLogin');
  }
};
</script>

<style lang="scss">
@import '@/assets/scss/main.scss';
</style>
