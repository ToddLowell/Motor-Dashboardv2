<template>
  <button v-if="!link" :class="mode">
    <slot></slot>
  </button>
  <router-link v-else :to="to" :class="mode">
    <slot></slot>
  </router-link>
</template>

<script>
// mode = null, flat, outline

export default {
  props: {
    mode: {
      type: String,
      required: false,
      default: null
    },
    link: {
      type: Boolean,
      required: false,
      default: false
    },
    to: {
      type: String,
      required: false,
      default: '/'
    }
  }
};
</script>

<style lang="scss" scoped>
button,
a {
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  font: inherit;
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
  color: #fff;
  cursor: pointer;
  border-radius: 30px;
  margin-right: 0.5rem;
  display: inline-block;

  &:hover,
  &:active {
    background: var(--color-primary-light);
    border-color: var(--color-primary-light);
  }
}

.flat {
  border: none;
}

.outline {
  border-color: var(--color-primary-light);
}

.flat,
.outline {
  background: transparent;
  color: var(--color-primary);

  &:hover,
  &:active {
    background: var(--color-primary-light);
    color: #fff;
  }
}
</style>
