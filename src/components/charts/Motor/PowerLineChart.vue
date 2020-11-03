<template>
  <div class="motor__graph-container">
    <canvas :id="`lineChart-power-motor${id}`" width="500" height="150"></canvas>
    <p>Power (W)</p>
  </div>
</template>

<script>
import Chart from 'chart.js';

var optionsLine = {
  // backgroundColor: 'transparent',
  maintainAspectRatio: false,
  responsive: true,
  // responsive: true,
  // pointBorderColor: 'transparent',
  elements: {
    point: {
      radius: 0
      // pointStyle: 'rectRot',
    }
  },
  tooltips: {
    mode: 'index',
    // axis: 'y',
    intersect: false,
    callbacks: {
      label: item => `${item.yLabel.toFixed(2)} W`
    }
  },
  title: {
    display: false
  },
  legend: {
    display: false
  },
  scales: {
    xAxes: [
      {
        gridLines: { color: '#fff' },
        display: true,
        ticks: {
          autoSkip: false,
          callback: function(value, index, values) {
            // console.log(value, index, values);
            if (index) {
              let prevValue = values[index - 1];
              let prevDatetime = new Date(prevValue);
              let prevHour = prevDatetime.getHours();

              let datetime = new Date(value);
              let hours = datetime.getHours();

              // return if not new hour label
              if (hours === prevHour) return null;
              // console.log(hours, prevHour);

              // AM or PM for hours
              let ampm = hours >= 12 ? 'pm' : 'am';
              // subtract by 12
              hours = hours % 12;
              // if 0 then become 12
              hours = hours ? hours : 12;

              return hours + ' ' + ampm;
            } else {
              let datetime = new Date(value);
              let hours = datetime.getHours();
              let ampm = hours >= 12 ? 'pm' : 'am';
              hours = hours % 12;
              hours = hours ? hours : 12;

              return hours + ' ' + ampm;
            }
          },
          fontColor: 'white'
        }
      }
    ],
    yAxes: [
      {
        gridLines: { color: '#fff' },
        display: true,
        ticks: {
          fontColor: 'white',
          maxTicksLimit: 4
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
    window['lineChart_power_motor' + this.id] = new Chart(
      document.getElementById(`lineChart-power-motor${this.id}`),
      {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              borderColor: '#00d25b',
              fill: 'transparent'
            }
          ]
        },
        options: optionsLine
      }
    );
  }
};
</script>
