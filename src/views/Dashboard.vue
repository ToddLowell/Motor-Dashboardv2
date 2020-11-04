<template>
  <div class="container">
    <div class="nav">
      <div v-show="displaySidebar" class="nav--logo">
        <img src="@/assets/images/logo-mahb2.png" alt="" />
      </div>
      <div class="nav--text">
        <h1 class="header__primary">MAHB Baggage Handling System Dashboard</h1>
      </div>
      <div id="mute" class="btn">
        <fa :icon="['fas', 'volume-up']" />
      </div>
      <div class="sidebarToggle btn" @click="displaySidebar = !displaySidebar">
        <fa :icon="['fas', 'bars']" />
      </div>
    </div>
    <div class="content">
      <div v-show="displaySidebar" class="selector">
        <div class="selector-flex">
          <p class="selector--home">Home</p>
          <a
            :class="{ 'active-link': activeIndex === -1 }"
            @click="
              currentPage = 'home-page';
              activeIndex = -1;
            "
            ><fa :icon="['fas', 'th-large']" /> Dashboard</a
          >
          <p class="selector--motor">Motors</p>
          <a
            v-for="(id, i) in motorIDs"
            :key="i"
            :class="{ 'active-link': activeIndex === i }"
            @click="
              currentPage = `motor${i + 1}-page`;
              activeIndex = i;
            "
            ><fa :icon="['fas', 'cogs']" /> Motor {{ i + 1 }} - {{ id }}</a
          >

          <p class="selector--admin">Admin</p>
          <a id="work-log" @click="displayWorkLogForm = true">
            <fa :icon="['fas', 'pencil-alt']" /> Work Log
          </a>
          <router-link :to="'/work-list'"><fa :icon="['fas', 'book']" /> Work List</router-link>
          <router-link :to="'/admin-panel'" v-if="isAdmin">
            <fa :icon="['fas', 'desktop']" /> Admin Panel
          </router-link>
          <div class="selector--bottom">
            <div class="ringChartLegend" v-show="currentPage === 'home-page'">
              <p><fa :icon="['fas', 'thermometer-half']" /> Temperature</p>
              <p><fa :icon="['far', 'lightbulb']" /> Power</p>
              <p><fa :icon="['fas', 'battery-three-quarters']" /> Battery</p>
              <p><motor-svg-icon /> Vibration</p>
            </div>
            <a class="selector--sign-out" @click="signOut">
              <fa :icon="['fas', 'sign-out-alt']" /> Sign Out
            </a>
          </div>

          <span class="selector--version" style="margin-bottom: 1rem"
            >Logged in as: {{ username }}</span
          >
          <span class="selector--version">Version: 1.0.0_ST-001</span>
        </div>
      </div>
      <home-page
        v-show="currentPage === 'home-page'"
        :motorIDs="motorIDs"
        @hook:mounted="initHome"
      />
      <motor-page
        v-for="(id, i) in motorIDs"
        :key="i"
        v-show="currentPage === `motor${i + 1}-page`"
        :number="`${i + 1}`"
        :motor="`${id}`"
        @currentMotorID="csvSelectedMotor = $event"
        @openJqDialog="openDialog"
      />

      <!-- Icons Positioned over SVG -->
      <span
        v-show="currentPage === 'home-page'"
        v-for="(id, i) in motorIDs"
        :key="i + 'icon'"
        :id="`svgMotorIcon-${i + 1}`"
        style="color: transparent; position: absolute"
      >
        <fa :icon="['fas', 'thermometer-half']" class="tempIcon" />
        <fa :icon="['far', 'lightbulb']" class="wattIcon" />
        <fa :icon="['fas', 'battery-three-quarters']" class="battIcon" />
        <motor-svg-icon class="vibIcon" />
      </span>
    </div>

    <!-- Work Log Form Popup -->
    <work-log-form
      :motorIDs="motorIDs"
      v-if="displayWorkLogForm"
      @close="displayWorkLogForm = false"
    />

    <!-- Dialog for Custom Average -->
    <div id="averageDialog" title="Custom Range..." style="display: none">
      <p>Select Dates:</p>
      <input id="litepicker" required />
      <br /><br />
      <p>Select Group By:</p>
      <select id="groupBy">
        <option>Hour</option>
        <option>Day</option>
        <option>Week</option>
        <option>Month</option>
      </select>
      <br />
      <button
        class="btn--submit"
        id="getCustomAvgGraph"
        style="float: right; background: green; color: white"
      >
        Submit
      </button>
      <span id="dialog--parameter" style="display: none"></span>
      <span id="dialog--motorID" style="display: none"></span>
      <span id="dialog--chart" style="display: none"></span>
    </div>

    <!-- Dialog for Motor Data CSV Download -->
    <div id="downloadCsvDialog" title="Download Data" style="display: none">
      <div v-show="selectedDataType != 'avg. vrms'">
        <p>Select Dates:</p>
        <input id="litepicker2" required />
        <br /><br />
      </div>
      <p>Select Motor:</p>
      <select name="motorID" v-model="csvSelectedMotor" required>
        <option v-for="(motorID, i) in motorIDs" :key="i">{{ motorID }}</option>
      </select>
      <br /><br />
      <div v-if="selectedDataType == 'avg. vrms'">
        <p>Select Group By:</p>
        <select name="motorID" v-model="csvVrmsTimeRange" required>
          <option value="1 day">1 Day</option>
          <option value="1 week">1 Week</option>
          <option value="1 month">1 Month</option>
          <option value="1 year">1 Year</option>
        </select>
        <br /><br />
      </div>
      <div v-if="selectedDataType == 'custom avg. vrms'">
        <p>Select Group By:</p>
        <select name="motorID" v-model="csvVrmsGroupBy" required>
          <option value="hour">Hour</option>
          <option value="day">Day</option>
          <option value="week">Week</option>
          <option value="month">Month</option>
        </select>
        <br /><br />
      </div>
      <p>Select Format:</p>
      <select name="motorID" v-model="selectedDataType" required>
        <option v-for="(csvDataTypes, i) in csvDataTypes" :key="i">{{ csvDataTypes }}</option>
      </select>
      <br /><br />
      <button
        class="btn--submit"
        style="float: right; background: green; color: white"
        @click="downloadData('data')"
      >
        Download
      </button>
    </div>

    <!-- Dialog for Status Log CSV Download -->
    <div id="downloadStatusCsvDialog" title="Download Status Log" style="display: none">
      <p>Select Dates:</p>
      <input id="litepicker3" required />
      <br /><br />
      <p>Select Motor:</p>
      <select name="motorID" v-model="csvSelectedMotor" required>
        <option v-for="(motorID, i) in motorIDs" :key="i">{{ motorID }}</option>
      </select>
      <br /><br />
      <p>Select Format:</p>
      <select name="motorID" v-model="selectedStatusType" required>
        <option v-for="(statusType, i) in csvStatusTypes" :key="i">{{ statusType }}</option>
      </select>
      <br /><br />
      <button
        class="btn--submit"
        style="float: right; background: green; color: white"
        @click="downloadData('status')"
      >
        Download
      </button>
    </div>
  </div>
</template>

<script>
// jQuery UI imports
import $ from 'jquery';
require('jquery-ui/ui/widgets/sortable');
require('jquery-ui/ui/widgets/dialog');
import Litepicker from 'litepicker';

import init from '../assets/js/index.js';

import { eventBus } from '../main.js';
import motorSvgIcon from '../components/charts/MotorSvgIcon.vue';
import homePage from '../components/Home.vue';
import motorPage from '../components/Motor.vue';
import workLogForm from '../components/WorkLogForm.vue';

export default {
  components: {
    homePage,
    motorPage,
    workLogForm,
    motorSvgIcon
  },
  data() {
    return {
      currentPage: 'home-page',
      activeIndex: -1,
      displaySidebar: true,
      displayWorkLogForm: false,
      csvDataTypes: ['data', 'avg. vrms', 'custom avg. vrms'],
      selectedDataType: 'data',
      csvStatusTypes: ['alert', 'log'],
      selectedStatusType: 'alert',
      csvVrmsTimeRange: '1 day',
      csvVrmsGroupBy: 'day',
      csvSelectedMotor: null,
      username: localStorage.getItem('username'),
      firstTimeSetUp: false,
      ringChartAlignmentVar: {},
      resizeObserver: null
    };
  },
  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    motorIDs() {
      return this.$store.getters.motorIDs;
    }
  },
  created() {
    // listen to event bus if ring chart or SVG is clicked
    eventBus.$on('goToMotor', data => {
      this.activeIndex = data;
      this.currentPage = `motor${data + 1}-page`;
    });

    eventBus.$on('customAverageRange', (param, id, motorID) => {
      this.customAverageGraphRange(param, id, motorID);
    });

    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(document.querySelector('body'));

    ['resize'].forEach(event => {
      window.addEventListener(event, this.onResize);
    });
  },
  mounted() {
    // init datepicker
    var lite = new Litepicker({
      element: document.getElementById('litepicker'),
      singleMode: false,
      maxDate: new Date(),
      showTooltip: false
    });

    var lite2 = new Litepicker({
      element: document.getElementById('litepicker2'),
      singleMode: false,
      maxDate: new Date(),
      showTooltip: false
    });

    var lite3 = new Litepicker({
      element: document.getElementById('litepicker3'),
      singleMode: false,
      maxDate: new Date(),
      showTooltip: false
    });

    window.lite = lite;
    window.lite2 = lite2;
    window.lite3 = lite3;

    // make ring charts sortable
    $('#sortable').sortable({
      opacity: 0.8
    });

    // don't display dialogs by default
    $('#averageDialog').dialog({
      autoOpen: false
    });
    $('#downloadCsvDialog').dialog({
      autoOpen: false
    });
    $('#downloadStatusCsvDialog').dialog({
      autoOpen: false
    });

    // custom average dialog
    $('#getCustomAvgGraph').click(() => {
      var parameter = $('#dialog--parameter').html();
      var motorID = $('#dialog--motorID').html();
      var chart = $('#dialog--chart').html();
      var startDate = lite.getStartDate();
      var endDate = lite.getEndDate();

      if (startDate === null || endDate === null) return;

      var begin =
        startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate();

      var end =
        endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + (endDate.getDate() + 1);

      var e = document.getElementById('groupBy');
      var groupBy = e.options[e.selectedIndex].text.toLowerCase();

      window.customAverageGraph(motorID, parameter, begin, end, groupBy, chart);
      lite.clearSelection();
      $('#averageDialog').dialog('close');
    });

    // svg alert icons over svg on home page alignment
    this.onResize();
  },
  methods: {
    initHome() {
      init();
    },
    signOut() {
      this.$store.dispatch('logout');
    },
    customAverageGraphRange(param, id, motorID) {
      if (param === 'temp') {
        let parameter = `avg_temperature`;
        let chart = `barChart_temperature_motor${id}`;

        $('#dialog--parameter').html(parameter);
        $('#dialog--motorID').html(motorID);
        $('#dialog--chart').html(chart);
        $('#averageDialog').dialog('open');
      } else if (param === 'power') {
        let parameter = `avg_power`;
        let chart = `barChart_current_motor${id}`;

        $('#dialog--parameter').html(parameter);
        $('#dialog--motorID').html(motorID);
        $('#dialog--chart').html(chart);
        $('#averageDialog').dialog('open');
      } else if (param === 'vrms') {
        let parameter = `avg_vrmsmax`;
        let chart = `barChart_vrms_motor${id}`;

        $('#dialog--parameter').html(parameter);
        $('#dialog--motorID').html(motorID);
        $('#dialog--chart').html(chart);
        $('#averageDialog').dialog('open');
      }
    },
    openDialog(e) {
      if (e == 'data') $('#downloadCsvDialog').dialog('open');
      else if (e == 'status') $('#downloadStatusCsvDialog').dialog('open');
    },
    downloadData(type) {
      var startDate;
      var endDate;
      var api_url;
      var fileNameSuffix;

      if (type == 'data') {
        startDate = window.lite2.getStartDate();
        endDate = window.lite2.getEndDate();
      } else if (type == 'status') {
        startDate = window.lite3.getStartDate();
        endDate = window.lite3.getEndDate();
      }

      // avg. vrms does not use litepicker
      if (type == 'data' && this.selectedDataType == 'avg. vrms') {
        // pass
      } else {
        // return if no date is entered
        if (startDate == undefined || endDate == undefined) return;

        // format date
        var begin =
          startDate.getFullYear() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getDate();

        var end =
          endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + (endDate.getDate() + 1);

        // for alert to show original date
        var endOri =
          endDate.getFullYear() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getDate();
      }

      if (type == 'data') {
        if (this.selectedDataType == 'data') {
          // file name
          fileNameSuffix = 'data';

          // api url
          api_url = this.$store.state.api.csvDownload
            .replace('%devid%', this.csvSelectedMotor)
            .replace('%begindate%', begin)
            .replace('%enddate%', end);
        } else if (this.selectedDataType == 'avg. vrms') {
          // file name
          fileNameSuffix = 'vrms_max';

          const timerange = this.csvVrmsTimeRange;
          let timeslot = null;
          if (timerange == '1 day') timeslot = 'hour';
          else if (timerange == '1 week') timeslot = 'day';
          else if (timerange == '1 month') timeslot = 'week';
          else if (timerange == '1 year') timeslot = 'month';

          // api url
          api_url = this.$store.state.api.csvVrmsDownload
            .replace('%devid%', this.csvSelectedMotor)
            .replace('%timerange%', timerange)
            .replace('%timeslot%', timeslot);
        } else if (this.selectedDataType == 'custom avg. vrms') {
          // file name
          fileNameSuffix = 'vrms_max';

          // api url
          api_url = this.$store.state.api.csvDownload
            .replace('%devid%', this.csvSelectedMotor)
            .replace('%begindate%', begin)
            .replace('%enddate%', end)
            .replace('%timeslot%', this.csvVrmsGroupBy);
        }
      } else if (type == 'status') {
        if (this.selectedStatusType == 'alert') {
          // file name
          fileNameSuffix = 'status_alert';

          // api url
          api_url = this.$store.state.api.statusAlertDownload
            .replace('%devid%', this.csvSelectedMotor)
            .replace('%begindate%', begin)
            .replace('%enddate%', end);
        } else if (this.selectedStatusType == 'log') {
          // file name
          fileNameSuffix = 'status_log';

          // api url
          api_url = this.$store.state.api.statusLogDownload
            .replace('%devid%', this.csvSelectedMotor)
            .replace('%begindate%', begin)
            .replace('%enddate%', end);
        }
      }

      window.downloadCSV(api_url, begin, endOri, fileNameSuffix, this.csvSelectedMotor);

      $('#downloadCsvDialog').dialog('close');
    },
    positionRingCharts() {
      // resize ring charts so that the flex children have equal number of elements per line on flex-wrap
      const allCharts = document.querySelectorAll('.chart-container');
      const chart = document.querySelector('.chart-container');
      const chart_container = document.querySelector('.chart-list');

      let paddingContainer = null;
      let num = null;
      let width = null;

      if (!this.firstTimeSetUp) {
        this.firstTimeSetUp = true;

        // number of charts
        num = allCharts.length;
        // width of element
        width = parseInt(chart.offsetWidth);
        // get margin from style of element
        const margin = chart.currentStyle || window.getComputedStyle(chart);
        // full width = width + margin
        width = width + parseInt(margin.marginLeft) + parseInt(margin.marginRight);

        // get padding from style of element
        paddingContainer = chart_container.currentStyle || window.getComputedStyle(chart_container);
        paddingContainer =
          parseInt(paddingContainer.paddingLeft) + parseInt(paddingContainer.paddingRight);

        // store in memory
        this.ringChartAlignmentVar['paddingContainer'] = paddingContainer;
        this.ringChartAlignmentVar['num'] = num;
        this.ringChartAlignmentVar['width'] = width;
      } else {
        paddingContainer = this.ringChartAlignmentVar['paddingContainer'];
        num = this.ringChartAlignmentVar['num'];
        width = this.ringChartAlignmentVar['width'];
      }

      // width of container
      const widthContainer = parseInt(chart_container.offsetWidth);

      // calculate items per row
      const itemsPerRow = Math.min(parseInt((widthContainer - paddingContainer) / width), num);

      // wrap rows

      // calculate number of rows
      const numOfRows = Math.ceil(num / itemsPerRow);

      // if elements will wrap then 6 items per row
      if (numOfRows == 2) {
        allCharts.forEach(cur => {
          const extraSpace = widthContainer - parseInt(chart.offsetWidth) * 6;
          const mg = Math.floor(extraSpace / 6 / 2);
          cur.style.marginLeft = mg + 'px';
          cur.style.marginRight = mg + 'px';
        });
      } else if (numOfRows == 3) {
        allCharts.forEach(cur => {
          const extraSpace = widthContainer - parseInt(chart.offsetWidth) * 4;
          const mg = extraSpace / 4 / 2;
          cur.style.marginLeft = mg + 'px';
          cur.style.marginRight = mg + 'px';
        });
      } else {
        allCharts.forEach(cur => {
          cur.style.marginLeft = 20 + 'px';
          cur.style.marginRight = 20 + 'px';
        });
      }
    },
    positionSvgAlertIcons() {
      const iconsWidth = document.getElementById('svgMotorIcon-1').getBoundingClientRect().width;
      const svgMotorWidth = document.getElementById('motor1').getBoundingClientRect().width;
      const offset = Math.floor((svgMotorWidth - iconsWidth) / 2);

      for (let i = 0; i < 11; i++) {
        let relPos = $(`#motor${i + 1}`).offset();
        $(`#svgMotorIcon-${i + 1}`).offset({
          top: relPos.top - 20,
          left: relPos.left + offset
        });
      }
    },
    onResize() {
      this.positionRingCharts();
      setTimeout(this.positionSvgAlertIcons, 0);
    }
  },
  beforeDestroy() {
    this.resizeObserver.unobserve(document.querySelector('body'));
    // unregister the event listener before destroying this Vue instance
    ['resize', 'click'].forEach(event => {
      window.removeEventListener(event, this.onResize);
    });
  }
};
</script>
