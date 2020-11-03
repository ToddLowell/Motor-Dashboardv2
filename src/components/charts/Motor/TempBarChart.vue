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
            'avg_temperature',
            '1 day',
            'hour',
            barChart_temperature_motor${id}
          );`
          "
          >1 Day</a
        >
        <a
          class="dropdown-item"
          :onclick="
            `plotAverageGraph(
            '${motorID}',
            'avg_temperature',
            '1 week',
            'day',
            barChart_temperature_motor${id}
          );`
          "
          >1 Week</a
        >
        <a
          class="dropdown-item"
          :onclick="
            `plotAverageGraph(
            '${motorID}',
            'avg_temperature',
            '1 month',
            'week',
            barChart_temperature_motor${id}
          );`
          "
          >1 Month</a
        >
        <a
          class="dropdown-item"
          :onclick="
            `plotAverageGraph(
            '${motorID}',
            'avg_temperature',
            '1 year',
            'month',
            barChart_temperature_motor${id}
          );`
          "
          >1 Year</a
        >
        <a :class="`dropdown-item`" @click="customRange('temp')">Custom...</a>
      </template>
    </dropdown>

    <canvas :id="`barChart-temperature-motor${id}`" width="500" height="150"></canvas>
    <p>Temperature (°C)</p>
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
    window['barChart_temperature_motor' + this.id] = new Chart(
      document.getElementById(`barChart-temperature-motor${this.id}`),
      {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              backgroundColor: '#0090e7'
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
                  suggestedMin: 30,
                  suggestedMax: 50,
                  maxTicksLimit: 5
                  // beginAtZero: true,
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
              label: item => `${item.yLabel.toFixed(2)} °C`
            }
          }
        }
      }
    );
  }
};
</script>
