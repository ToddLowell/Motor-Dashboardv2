<template>
  <div class="card">
    <div class="widget">
      <div class="widget__icon">
        <fa :icon="['far', 'clock']" />
      </div>
      <div class="widget__body">
        <h4 id="currentTime">{{ currentTime }}</h4>
        <p>Current Local Time</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      now: new Date()
    };
  },
  computed: {
    currentTime() {
      var now = this.now;
      var TwentyFourHour = now.getHours();
      var hour = now.getHours();
      var min = now.getMinutes();
      var sec = now.getSeconds();
      var mid = 'pm';
      if (sec < 10) {
        sec = '0' + sec;
      }
      if (min < 10) {
        min = '0' + min;
      }
      if (hour > 12) {
        hour = hour - 12;
      }
      if (hour == 0) {
        hour = 12;
      }
      if (TwentyFourHour < 12) {
        mid = 'am';
      }

      var date = now.toLocaleDateString();

      return date + ', ' + hour + ':' + min + ':' + sec + ' ' + mid;
    }
  },
  created() {
    setInterval(() => {
      this.now = new Date();
    }, 1000);
  }
};
</script>
