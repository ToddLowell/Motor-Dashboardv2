<template>
  <div class="motor-page page" :id="`motor${number}-page`">
    <div class="motor__graphs">
      <div class="btn downloadCSV" @click="downloadCSV('data')">
        <fa :icon="['fas', 'download']" class="downloadCSV" />
      </div>
      <button
        class="btn motor__graphs--switch"
        @click="displayTime = !displayTime"
        style="z-index: 1000"
      >
        <fa :icon="['fas', 'bars']" />
      </button>
      <div class="motor__graph--time card" v-show="displayTime">
        <h2 class="heading__secondary">Time Series Graph</h2>
        <power-line-chart :id="parseInt(number)" :motorID="motor"></power-line-chart>

        <temperature-line-chart :id="parseInt(number)" :motorID="motor"></temperature-line-chart>
      </div>

      <div class="motor__graph--average card" v-show="!displayTime">
        <h2 class="heading__secondary">Average Graph</h2>
        <power-bar-chart :id="parseInt(number)" :motorID="motor"></power-bar-chart>

        <temperature-bar-chart :id="parseInt(number)" :motorID="motor"></temperature-bar-chart>
      </div>
    </div>

    <div class="motor__graphs-2">
      <button
        class="btn motor__graphs--switch"
        @click="displayFreqMag = !displayFreqMag"
        style="z-index: 1000"
      >
        <fa :icon="['fas', 'bars']" />
      </button>
      <freq-mag-bar :id="parseInt(number)" :motorID="motor" v-show="displayFreqMag"></freq-mag-bar>
      <freq-vrms-line
        :id="parseInt(number)"
        :motorID="motor"
        v-show="!displayFreqMag"
      ></freq-vrms-line>
    </div>

    <div class="motor__status card">
      <button
        class="btn motor__graphs--switch"
        @click="displayStatusLog = !displayStatusLog"
        style="z-index: 1000"
      >
        <fa :icon="['fas', 'bars']" />
      </button>
      <div class="btn downloadCSV" @click="downloadCSV('status')">
        <fa :icon="['fas', 'download']" class="downloadCSV" />
      </div>
      <div
        v-show="displayStatusLog"
        style="width: 100%; display: flex; flex-direction: column; align-items: center;"
      >
        <h2 class="heading__secondary">Status</h2>
        <div class="motor__status--container">
          <div class="motor__status--topbar">
            <p>Warning</p>
            <div class="btn" @click="clearWarnings">
              <fa :icon="['fas', 'ban']" />
            </div>
          </div>
          <div class="motor__status--container-row" data-simplebar>
            <div class="motor__status--warnings" :id="`status-motor${number}`"></div>
          </div>
        </div>
      </div>
      <div
        v-show="!displayStatusLog"
        style="width: 100%; display: flex; flex-direction: column; align-items: center;"
      >
        <h2 class="heading__secondary">Vrms Max Average Graph</h2>
        <vrms-bar-chart :id="parseInt(number)" :motorID="motor"></vrms-bar-chart>
      </div>

      <div class="motor__status--meters">
        <div>
          <battery-gauge :id="parseInt(number)" :motorID="motor"></battery-gauge>
          <p>Battery</p>
        </div>
        <div>
          <rssi-gauge :id="parseInt(number)" :motorID="motor"></rssi-gauge>
          <p>RSSI</p>
        </div>
      </div>
    </div>

    <div class="motor__graph--freq-vrms card">
      <h2 class="heading__secondary">Frequency vs. Vrms Chart</h2>
      <div>
        <div class="motor__table-container" :id="`table-freq-vrms-motor${number}`">
          <table>
            <tr class="table__vrms">
              <td class="table__vrms--title">Vrms</td>
              <td :id="`vrms-motor${number}-1`">1</td>
              <td :id="`vrms-motor${number}-2`">2</td>
              <td :id="`vrms-motor${number}-3`">3</td>
              <td :id="`vrms-motor${number}-4`">4</td>
              <td :id="`vrms-motor${number}-5`">5</td>
              <td :id="`vrms-motor${number}-6`">6</td>
              <td :id="`vrms-motor${number}-7`">7</td>
              <td :id="`vrms-motor${number}-8`">8</td>
              <td :id="`vrms-motor${number}-9`">9</td>
              <td :id="`vrms-motor${number}-10`">10</td>
            </tr>
            <tr class="table__freq">
              <td class="table__freq--title">Frequency</td>
              <td :id="`freq-motor${number}-1`">1</td>
              <td :id="`freq-motor${number}-2`">2</td>
              <td :id="`freq-motor${number}-3`">3</td>
              <td :id="`freq-motor${number}-4`">4</td>
              <td :id="`freq-motor${number}-5`">5</td>
              <td :id="`freq-motor${number}-6`">6</td>
              <td :id="`freq-motor${number}-7`">7</td>
              <td :id="`freq-motor${number}-8`">8</td>
              <td :id="`freq-motor${number}-9`">9</td>
              <td :id="`freq-motor${number}-10`">10</td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import batteryGauge from './charts/Motor/BatteryGaugeChart';
import rssiGauge from './charts/Motor/RSSIGaugeChart';
import freqMagBar from './charts/Motor/FreqMagBarChart';
import freqVrmsLine from './charts/Motor/FreqVrmsLineChart';
import powerLineChart from './charts/Motor/PowerLineChart';
import temperatureLineChart from './charts/Motor/TempLineChart';
import powerBarChart from './charts/Motor/PowerBarChart';
import temperatureBarChart from './charts/Motor/TempBarChart';
import vrmsBarChart from './charts/Motor/VrmsMaxBarChart';

export default {
  components: {
    batteryGauge,
    rssiGauge,
    freqMagBar,
    freqVrmsLine,
    powerLineChart,
    temperatureLineChart,
    powerBarChart,
    temperatureBarChart,
    vrmsBarChart
  },
  props: {
    number: String,
    motor: String
  },
  data() {
    return {
      displayTime: true,
      displayFreqMag: true,
      displayStatusLog: true
    };
  },
  methods: {
    clearWarnings() {
      document.querySelector(`#status-motor${this.number}`).innerHTML = '';
    },
    downloadCSV(type) {
      if (type == 'data') this.$emit('openJqDialog', 'data');
      else if (type == 'status') this.$emit('openJqDialog', 'status');

      // send current Motor ID to parent
      this.$emit('currentMotorID', this.motor);
    }
  }
};
</script>
