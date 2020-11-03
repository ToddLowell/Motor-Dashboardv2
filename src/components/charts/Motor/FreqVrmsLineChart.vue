<template>
  <div class="motor__graph--freq-mag card">
    <h2 class="heading__secondary">Max Vrms vs. Time Graph</h2>
    <div class="motor__graph-container">
      <div class="motor__graph-vrms">
        <canvas
          :id="`lineChart-freq-vrms-motor${id}`"
          class="freq-mag-chart"
          width="550"
          height="300"
        ></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js';

var optionsLine = {
  maintainAspectRatio: false,
  responsive: true,
  title: {
    display: false
  },
  legend: {
    display: false
  },
  elements: {
    point: {
      radius: 3,
      pointStyle: 'circle',
      backgroundColor: 'white'
    }
  },
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: { color: '#fff' },
        scaleLabel: {
          display: true,
          fontColor: 'white',
          labelString: 'Frequency, Hz'
        },
        ticks: {
          autoSkip: false,
          callback: function(value, index, values) {
            // console.log(value, index, values);
            if (index) {
              let prevValue = values[index - 1];
              let prevDateObj = prevValue.split('at')[1].trim();
              let prevDatetime = new Date(prevDateObj);
              let prevHour = prevDatetime.getHours();

              let dateObj = value.split('at')[1].trim();
              let datetime = new Date(dateObj);
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
              let dateObj = value.split('at')[1].trim();
              let datetime = new Date(dateObj);
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
        display: true,
        gridLines: {
          color: '#fff',
          zeroLineColor: '#fff'
        },
        ticks: {
          fontColor: 'white'
        },
        scaleLabel: {
          display: true,
          fontColor: 'white',
          labelString: 'Vrms'
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
    window['lineChart_freq_vrms_motor' + this.id] = new Chart(
      document.getElementById(`lineChart-freq-vrms-motor${this.id}`),
      {
        type: 'line',
        data: {
          labels: [],
          datasets: [
            {
              data: [],
              borderColor: '#8f5fe8',
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
