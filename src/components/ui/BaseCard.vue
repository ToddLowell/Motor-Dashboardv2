<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.card {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  background-color: var(--card-color);
}
</style>
