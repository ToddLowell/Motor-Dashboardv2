<template>
  <div class="container login--container">
    <base-dialog :show="!!error" title="An Error Occured..." @close="closeError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog fixed :show="isLoading" title="Authenticating...">
      <base-spinner></base-spinner>
    </base-dialog>
    <div class="login--container card">
      <div class="login--image-holder">
        <img src="@/assets/images/logo-mahb2.png" alt="" class="login--image" />
        <p class="login--text">SIGN IN</p>
      </div>
      <form class="login--form">
        <div class="position-relative">
          <input
            class="login--form-element"
            type="text"
            placeholder="Enter Username"
            autocomplete="off"
            v-model="username"
            @keyup.enter="login"
          />
          <div class="login--form-icon">
            <fa :icon="['fas', 'user']" />
          </div>
        </div>
        <div class="position-relative">
          <input
            class="login--form-element"
            type="password"
            placeholder="Enter Password"
            autocomplete="off"
            v-model="password"
            @keyup.enter="login"
          />
          <div class="login--form-icon">
            <fa :icon="['fas', 'lock']" />
          </div>
        </div>
        <button @click="login" class="login--form-element login--button" type="button">
          SIGN IN
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      isLoading: false
    };
  },
  computed: {
    error() {
      return this.$store.getters.error;
    }
  },
  methods: {
    async login() {
      if (this.username === '' || this.password === '') return;

      this.isLoading = true;

      try {
        await this.$store.dispatch('login', {
          username: this.username,
          password: this.password
        });
      } catch (e) {
        console.log(e);
      }

      this.isLoading = false;
    },
    closeError() {
      this.$store.commit('setError', { error: null });
    }
  }
};
</script>
