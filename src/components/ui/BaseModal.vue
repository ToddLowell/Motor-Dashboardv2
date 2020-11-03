<template>
  <div>
    <div class="modal--mask" @click="$emit('close')" v-if="open"></div>
    <transition name="modal">
      <simple-bar class="modal--container" v-if="open">
        <header>
          <slot name="header">
            <h2 class="modal--title">{{ title }}</h2>
          </slot>
        </header>
        <section>
          <slot></slot>
        </section>
      </simple-bar>
    </transition>
  </div>
</template>

<script>
import SimpleBar from '../SimpleBar.vue';

export default {
  components: {
    SimpleBar
  },
  props: {
    title: {
      type: String,
      required: false
    },
    open: Boolean
  },
  beforeMount() {
    document.querySelector('body').style.overflow = 'hidden';
  },
  beforeDestroy() {
    document.querySelector('body').style.overflow = 'auto';
  }
};
</script>

<style lang="scss">
.modal--mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--backdrop);
  transition: opacity 0.3s ease;
}

.modal--container {
  position: fixed;
  top: 50vh;
  left: 50vw;
  max-height: 90vh;
  transform: translate(-50%, -50%);
  z-index: 9999;
  width: 50vw;
  background: #fff;
  border-radius: 5px;
  color: #333;
  text-align: center;
}

.modal--title {
  margin: 0.5em 0;
  font-size: 4rem;
  font-weight: 300;
}

///// Animation /////
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.8);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s;
}
</style>
