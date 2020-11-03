<template>
  <div class="battery__threshold" style="position: relative">
    <p class="perfect">100%</p>
    <p class="good">75%</p>
    <p class="satisfactory">50%</p>
    <p class="bad">25%</p>
    <p class="critical">0%</p>
    <canvas :id="`gauge-chart-battery-motor${id}`"></canvas>
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
    window['batteryGauge_motor' + this.id] = new Chart(
      document.getElementById(`gauge-chart-battery-motor${this.id}`),
      {
        type: 'gauge',
        data: {
          datasets: [
            {
              data: [25, 50, 75, 100],
              value: 25,
              backgroundColor: ['red', 'orange', 'yellow', 'green'],
              borderWidth: 0,
              borderColor: '#000'
            }
          ]
        },
        options: {
          responsive: true,
          // title: {
          //   display: true,
          //   text: 'Gauge chart',
          // },
          layout: {
            padding: {
              bottom: 5
            }
          },
          needle: {
            // Needle circle radius as the percentage of the chart area width
            radiusPercentage: 2,
            // Needle width as the percentage of the chart area width
            widthPercentage: 3.2,
            // Needle length as the percentage of the interval between inner radius (0%) and outer radius (100%) of the arc
            lengthPercentage: 80,
            // The color of the needle
            color: 'rgba(255, 255, 255, 1)'
          },
          valueLabel: {
            display: false,
            // formatter: Math.round,
            padding: {
              // top: 10,
            }
            // bottomMarginPercentage: -5,
          }
        }
      }
    );
  }
};
</script>
