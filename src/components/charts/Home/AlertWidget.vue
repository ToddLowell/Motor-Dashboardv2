<template>
  <div class="card">
    <div class="widget">
      <div class="widget__icon">
        <fa :icon="['fas', 'exclamation-circle']" />
      </div>
      <div class="widget__body">
        <h4 id="numberOfAlerts" ref="alerts">-</h4>
        <p>Number of Alerts</p>
      </div>
    </div>

    <!-- Alert Sound -->
    <audio autoplay loop muted ref="audio">
      <source src="@/assets/audio/alarm.mp3" type="audio/mpeg" />
      Your browser does not support the audio tag.
    </audio>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$refs.audio.muted = true;
  }
};
</script>
