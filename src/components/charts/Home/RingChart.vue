<template>
  <div class="chart-container">
    <div class="chart" @click="chartClicked">
      <div class="chart-critical"></div>
      <div class="chart-critical-2"></div>
      <div class="chart-start"></div>
      <div class="chart-start-icon">
        <img src="@/assets/images/icons/flag-start.png" />
      </div>
      <p>{{ id }}</p>
      <canvas :id="`ringChart${id}`" width="1000" height="1000"></canvas>
    </div>
    <table class="ringChart--table">
      <tr>
        <th class="temp">
          <fa :icon="['fas', 'thermometer-half']" />
        </th>
        <th class="watt">
          <fa :icon="['far', 'lightbulb']" />
        </th>
        <th class="batt">
          <fa :icon="['fas', 'battery-three-quarters']" />
        </th>
      </tr>
      <tr>
        <td :class="`temp-${id}`">-</td>
        <td :class="`watt-${id}`">-</td>
        <td :class="`batt-${id}`">-</td>
      </tr>
    </table>
  </div>
</template>

<script>
import { eventBus } from '../../../main.js';
import Chart from 'chart.js';

export default {
  props: {
    id: Number,
    motorID: String
  },
  methods: {
    chartClicked() {
      eventBus.$emit('goToMotor', this.id - 1);
    }
  },
  mounted() {
    window['ringChart' + this.id] = new Chart(document.getElementById(`ringChart${this.id}`), {
      type: 'doughnut',
      data: {
        datasets: [
          {
            labels: ['Temperature', 'undefined'],
            data: [0, 100],
            dataOri: [0],
            unit: '° C',
            backgroundColor: ['#6eb5ff', '#6c7293'],
            borderColor: 'transparent'
          },
          {
            labels: ['Watt', 'undefined'],
            data: [0, 100],
            dataOri: [0],
            unit: ' W',
            backgroundColor: ['#aff8d8', '#6c7293'],
            borderColor: 'transparent'
          },
          {
            labels: ['Battery Level', 'undefined'],
            data: [0, 100],
            dataOri: [0],
            unit: '%',
            backgroundColor: ['#fff5ba', '#6c7293'],
            borderColor: 'transparent'
          }
        ]
      },
      options: {
        rotation: 0 * Math.PI,
        cutoutPercentage: 35,

        tooltips: {
          enabled: false
        },

        legend: {
          display: false
        }
      }
    });
  }
};
</script>
