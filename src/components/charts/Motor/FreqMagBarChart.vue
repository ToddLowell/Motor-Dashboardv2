<template>
  <div class="motor__graph--freq-mag card">
    <h2 class="heading__secondary">Frequency vs. Magnitude Graph</h2>
    <div class="motor__graph-container">
      <canvas
        :id="`barChart-freq-mag-motor${id}`"
        class="freq-mag-chart"
        width="550"
        height="300"
      ></canvas>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js';

var options = {
  maintainAspectRatio: false,
  responsive: true,
  title: {
    display: false
  },
  legend: {
    display: false
  },
  scales: {
    xAxes: [
      {
        display: true,
        // gridLines: { color: '#fff' },
        // type: 'linear',
        type: 'time',
        time: {
          parser: 'Y',
          unit: 'year',
          unitStepSize: 100,
          displayFormats: {
            year: 'Y'
          }
        },
        ticks: {
          fontColor: 'white',
          max: '1000',
          min: '0',
          callback: function(value) {
            value = value.replace(/^0+/, '');
            if (value === '') value = '0';
            return value;
          }
          // suggestedMin: 0,
          // suggestedMax: 1000,
          // stepSize: 200,
        },
        scaleLabel: {
          display: true,
          fontColor: 'white',
          labelString: 'Frequency, Hz'
        }
      }
    ],
    yAxes: [
      {
        display: true,
        gridLines: {
          color: '#fff',
          zeroLineColor: '#fff'
        },
        ticks: {
          fontColor: 'white',
          suggestedMin: 0
        },
        scaleLabel: {
          display: true,
          fontColor: 'white',
          labelString: 'Magnitude, g'
        }
      }
    ]
  }
};

export default {
  props: {
    id: Number,
    motorID: String
  },
  mounted() {
    window['barChart_freq_mag_motor' + this.id] = new Chart(
      document.getElementById(`barChart-freq-mag-motor${this.id}`),
      {
        type: 'bar',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              barThickness: 8,
              // minBarLength: 8,
              // maxBarThickness: 12,
              backgroundColor: '#8f5fe8',
              // backgroundColor: [
              //   '#8f5fe8',
              //   'orange',
              //   '#8f5fe8',
              //   'orange',
              //   '#8f5fe8',
              //   'orange',
              //   '#8f5fe8',
              //   'orange',
              //   '#8f5fe8',
              //   'orange',
              // ],
              borderColor: '#fff',
              borderWidth: 1,
              fill: 'transparent',
              xAxisID: 0,
              yAxisID: 0
            }
          ]
        },
        options: options
      }
    );
  }
};
</script>
