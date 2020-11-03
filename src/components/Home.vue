<template>
  <div class="home-page page" id="home-page">
    <div class="home-page--widgets">
      <alert-widget></alert-widget>
      <uptime-widget></uptime-widget>
      <weather-widget></weather-widget>
      <clock-widget></clock-widget>
    </div>
    <div class="home-page--preview">
      <div class="parameters card">
        <div>
          <h2 class="heading__secondary">Realtime Critical Parameters</h2>
        </div>
        <div class="chart-list" id="sortable">
          <ring-chart
            v-for="(motorID, i) in motorIDs"
            :key="i"
            :id="i + 1"
            :motorID="motorID"
          ></ring-chart>
        </div>
        <p id="parameters__update-time">last updated: --:--:--</p>
      </div>

      <div class="status card">
        <h2 class="heading__secondary">Electric Motor Location</h2>
        <div class="svg">
          <svg-motor></svg-motor>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ringChart from './charts/Home/RingChart.vue';
import svgMotor from './MotorSVG.vue';
import alertWidget from './charts/Home/AlertWidget.vue';
import weatherWidget from './charts/Home/WeatherWidget.vue';
import clockWidget from './charts/Home/ClockWidget.vue';
import uptimeWidget from './charts/Home/UptimeWidget.vue';

export default {
  components: {
    ringChart,
    svgMotor,
    alertWidget,
    weatherWidget,
    clockWidget,
    uptimeWidget
  },
  props: {
    motorIDs: Array
  },
  created() {
    console.log('Home Page Rendered');
  }
};
</script>
