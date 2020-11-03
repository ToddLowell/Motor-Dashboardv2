<template>
  <div class="motor__graph-container">
    <dropdown :is-icon="false" :close-on-click="true" class="dropdown">
      <template slot="btn">
        <fa :icon="['fas', 'chevron-circle-down']" />
      </template>
      <template slot="body">
        <a
          class="dropdown-item"
          :onclick="
            `plotAverageGraph(
             '${motorID}',
             'avg_power',
             '1 day',
             'hour',
             barChart_current_motor${id}
           );`
          "
          >1 Day</a
        >
        <a
          class="dropdown-item"
          :onclick="
            `plotAverageGraph(
             '${motorID}',
             'avg_power',
             '1 week',
             'day',
             barChart_current_motor${id}
           );`
          "
          >1 Week</a
        >
        <a
          class="dropdown-item"
          :onclick="
            `plotAverageGraph(
             '${motorID}',
             'avg_power',
             '1 month',
             'week',
             barChart_current_motor${id}
           );`
          "
          >1 Month</a
        >
        <a
          class="dropdown-item"
          :onclick="
            `plotAverageGraph(
             '${motorID}',
             'avg_power',
             '1 year',
             'month',
             barChart_current_motor${id}
           );`
          "
          >1 Year</a
        >
        <a :class="`dropdown-item avg-power-motor${id}`" @click="customRange('power')">Custom...</a>
      </template>
    </dropdown>

    <canvas :id="`barChart-current-motor${id}`" width="500" height="150"></canvas>
    <p>Power (W)</p>
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
    customRange(param) {
      eventBus.$emit('customAverageRange', param, this.id, this.motorID);
    }
  },
  mounted() {
    window['barChart_current_motor' + this.id] = new Chart(
      document.getElementById(`barChart-current-motor${this.id}`),
      {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              backgroundColor: '#00d25b'
            }
          ]
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          legend: { display: false },
          title: {
            display: true,
            fontColor: '#fff',
            text: '1 Week Averaged by Day'
          },
          scales: {
            xAxes: [
              {
                gridLines: { color: '#fff' },
                display: true,
                ticks: {
                  fontColor: 'white',
                  callback: function(value) {
                    // check if the label is by hour or not by checking or am|pm in the string
                    if (value.includes('am') || value.includes('pm')) {
                      // in the format 5 am, 10/5/2020
                      var hours = value.split(',')[0];

                      return hours;
                    }
                    // else return the default value
                    else {
                      return value;
                    }
                  }
                }
              }
            ],
            yAxes: [
              {
                gridLines: { color: '#fff' },
                display: true,
                ticks: {
                  fontColor: 'white',
                  suggestedMin: 120,
                  suggestedMax: 150,
                  maxTicksLimit: 4
                }
              }
            ]
          },
          layout: {
            padding: {
              // bottom: 40,
            }
          },
          tooltips: {
            caretSize: 0,
            callbacks: {
              label: item => `${item.yLabel.toFixed(2)} W`
            }
          }
        }
      }
    );
  }
};
</script>
