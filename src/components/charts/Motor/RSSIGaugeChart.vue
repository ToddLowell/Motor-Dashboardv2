<template>
  <div class="rssi__threshold" style="position: relative">
    <p class="perfect"></p>
    <p class="good">- 50 dBm</p>
    <p class="satisfactory">- 80 dBm</p>
    <p class="bad">- 100 dBm</p>
    <p class="critical"></p>
    <canvas :id="`gauge-chart-rssi-motor${id}`"></canvas>
  </div>
</template>

<script>
import Chart from 'chartjs-gauge';

export default {
  props: {
    id: Number,
    motorID: String
  },
  mounted() {
    window['rssiGauge_motor' + this.id] = new Chart(
      document.getElementById(`gauge-chart-rssi-motor${this.id}`),
      {
        type: 'gauge',
        data: {
          datasets: [
            {
              data: [25, 50, 75, 100],
              value: 85,
              backgroundColor: ['red', 'orange', 'yellow', 'green'],
              borderWidth: 0,
              borderColor: '#000'
            }
          ]
        },
        options: {
          responsive: true,
          layout: {
            padding: {
              bottom: 5
            }
          },
          needle: {
            radiusPercentage: 2,
            widthPercentage: 3.2,
            lengthPercentage: 80,
            color: 'rgba(255, 255, 255, 1)'
          },
          valueLabel: {
            display: false
          }
        }
      }
    );
  }
};
</script>
