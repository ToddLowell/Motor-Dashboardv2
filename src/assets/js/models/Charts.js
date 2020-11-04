/* eslint-disable */
import axios from '@/axios';
import store from '@/store';
const { Parser } = require('json2csv');

let threshold;
let muteAlarm = false;
let alarmPresent = false;
var latestInterval = null;
var uptimeInterval = null;

const motorIDs = store.getters.motorIDs;

const motorState = Array.from({ length: motorIDs.length }, () => ({
  lastUpdate: undefined,
  alert: false,
  tempCritical: false,
  wattCritical: false,
  battCritical: false,
  vrmsCritical: false
}));

window.plotAverageGraph = plotAverageGraph;
window.customAverageGraph = customAverageGraph;
window.downloadCSV = downloadCSV;

// setup
export function init(thresholds) {
  // set global thresholds object
  threshold = thresholds;

  // plot initial bar chart
  for (let i = 1; i < motorIDs.length + 1; i++) {
    plotAverageGraph(
      motorIDs[i - 1],
      'avg_power',
      '1 week',
      'day',
      eval('barChart_current_motor' + i)
    );
    plotAverageGraph(
      motorIDs[i - 1],
      'avg_temperature',
      '1 week',
      'day',
      eval('barChart_temperature_motor' + i)
    );
    plotAverageGraph(
      motorIDs[i - 1],
      'avg_vrmsmax',
      '1 week',
      'day',
      eval('barChart_vrms_motor' + i)
    );
  }

  // plot the other charts
  for (var i = 0; i < motorIDs.length; i++) {
    updateCharts(motorIDs[i]);
    checkStatus(motorIDs[i], 10);
  }

  // get uptime
  uptimewidget();

  // check latest values every second
  latestInterval = setInterval(() => {
    checkLatestValues();
  }, 1000);

  // update uptime every minute
  uptimeInterval = setInterval(() => {
    uptimewidget();
  }, 60000);

  // alarm
  muteButtonListener();
}

export function close() {
  clearInterval(latestInterval);
  clearInterval(uptimeInterval);
}

////////////////////
// Dashboard
function muteButtonListener() {
  document.getElementById('mute').addEventListener('click', () => {
    const audioEl = document.querySelector('audio');
    const muteBtn = document.getElementById('mute');

    // if muted
    if (muteAlarm) {
      // sound alarn when unmuted if an alarm is present
      if (alarmPresent) audioEl.muted = false;
      muteBtn.classList.remove('isMuted');
      muteAlarm = false;
      console.log('unmuted');
    } else {
      audioEl.muted = true;
      muteBtn.classList.add('isMuted');
      muteAlarm = true;
      console.log('muted');
    }
  });
}

////////////////////
// Home Page
function uptimewidget() {
  const uptime = document.querySelector('.uptime__data-uptime');
  const load = document.querySelector('.uptime__data-load');
  axios
    .get(store.state.api.uptime)
    .then(res => {
      load.innerText =
        'Load: ' +
        res.data.load
          .split('load average: ')[1]
          .slice(0, 4)
          .trim();
      uptime.innerText = res.data.uptime.slice(3);
    })
    .catch(err => console.log(err));
}

// rescale function
function scaleBetween(unscaledNum, newMin, newMax, min, max) {
  // max should be at red line is at 32.5deg which is 91% circle
  let x = max - min;
  let y = Math.floor(x / 0.9);
  max = min + y;
  return Math.floor(((newMax - newMin) * (unscaledNum - min)) / (max - min) + newMin);
}

// last updated time of ring charts on home page
function updateTimePlaceholder() {
  var updateTime = document.getElementById('parameters__update-time');
  var now = new Date();
  var hour = now.getHours();
  var min = now.getMinutes();
  var sec = now.getSeconds();
  if (sec < 10) {
    sec = '0' + sec;
  }
  if (min < 10) {
    min = '0' + min;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  var time = hour + ':' + min + ':' + sec;

  updateTime.innerHTML = `last updated: ${time}`;
}

// check for latest values every second
function checkLatestValues() {
  axios
    .get(store.state.api.latestValues)
    .then(res => {
      res.data.data.forEach(cur => {
        const id = motorIDs.indexOf(cur.device_id);
        // if motorID from API is not in list of motorIDs defined
        if (id === -1) return;
        if (cur['timestamp_raw'] > motorState[id].lastUpdate) {
          checkStatus(cur.device_id, 1);
          updateCharts(cur.device_id, cur);
        }
      });
    })
    .catch(err => console.log(err));
}

function plotRingChart(id, data) {
  // store data
  var temp = data['temperature'];
  var power = data['power'];
  var battery = data['battery'];

  var ringChart = eval('ringChart' + id);

  ringChart.data.datasets[0].dataOri[0] = temp;
  ringChart.data.datasets[1].dataOri[0] = power;
  ringChart.data.datasets[2].dataOri[0] = battery;

  updateRingChartTable(id, temp, power, battery);

  // rescale data
  temp = scaleBetween(temp, 0, 100, threshold.temp_1, threshold.temp_4);
  power = scaleBetween(power, 0, 100, threshold.watt_1, threshold.watt_4);

  // if less than 0 after rescale then make 0
  temp = temp < 0 ? 0 : temp;
  power = power < 0 ? 0 : power;
  battery = battery < 0 ? 0 : battery;

  // update chart
  ringChart.data.datasets[0].data[0] = temp;
  ringChart.data.datasets[0].data[1] = temp > 100 ? 0 : 100 - temp;
  ringChart.data.datasets[1].data[0] = power;
  ringChart.data.datasets[1].data[1] = power > 100 ? 0 : 100 - power;
  ringChart.data.datasets[2].data[0] = battery;
  ringChart.data.datasets[2].data[1] = battery > 100 ? 0 : 100 - battery;

  ringChart.update();

  checkRange(id);
  updateTimePlaceholder();
}

// update table under ring chart
function updateRingChartTable(id, temp, watt, battery) {
  temp = temp.toFixed(2);
  watt = watt.toFixed(0);
  battery = battery.toFixed(2);

  // temperature
  let tempDisplay = document.querySelector(`.temp-${id}`);
  tempDisplay.innerText = temp + '°C';

  if (temp > threshold.temp_4) tempDisplay.style.backgroundColor = 'red';
  else if (temp > threshold.temp_3) tempDisplay.style.backgroundColor = 'orange';
  else if (temp > threshold.temp_2) tempDisplay.style.backgroundColor = 'yellow';
  else tempDisplay.style.backgroundColor = 'limegreen';

  // power
  let wattDisplay = document.querySelector(`.watt-${id}`);
  wattDisplay.innerText = watt + 'W';

  if (watt > threshold.watt_4) wattDisplay.style.backgroundColor = 'red';
  else if (watt > threshold.watt_3) wattDisplay.style.backgroundColor = 'orange';
  else if (watt > threshold.watt_2) wattDisplay.style.backgroundColor = 'yellow';
  else wattDisplay.style.backgroundColor = 'limegreen';

  // battery
  let battDisplay = document.querySelector(`.batt-${id}`);
  battDisplay.innerText = battery + '%';

  if (battery < threshold.batt_4) battDisplay.style.backgroundColor = 'red';
  else if (battery < threshold.batt_3) battDisplay.style.backgroundColor = 'orange';
  else if (battery < threshold.batt_2) battDisplay.style.backgroundColor = 'yellow';
  else battDisplay.style.backgroundColor = 'limegreen';
}

// check value to give warning
function checkRange(id) {
  var ringChart = eval('ringChart' + id);

  // get original values
  var temp = ringChart.data.datasets[0].dataOri[0];
  var watt = ringChart.data.datasets[1].dataOri[0];
  var batt = ringChart.data.datasets[2].dataOri[0];

  // for ring chart warning blinker
  var el = document.getElementById(`ringChart${id}`).parentNode;

  if (temp > threshold.temp_4) motorState[id - 1].tempCritical = true;
  else motorState[id - 1].tempCritical = false;

  if (watt > threshold.watt_4) motorState[id - 1].wattCritical = true;
  else motorState[id - 1].wattCritical = false;

  if (batt < threshold.batt_4) motorState[id - 1].battCritical = true;
  else motorState[id - 1].battCritical = false;

  // red line is currently at 40 degrees
  if (
    motorState[id - 1].tempCritical ||
    motorState[id - 1].wattCritical ||
    motorState[id - 1].battCritical ||
    motorState[id - 1].vrmsCritical
  ) {
    // set blinker on ring chart
    el.classList.add('chart--blinker');
  } else {
    el.classList.remove('chart--blinker');
  }

  // handle alerts
  motorStateAlert();
}

////////////////////
// Motor Detail Page
async function plotAverageGraph(devid, item, timerange, timeslot, chart) {
  var dataArr = [];
  var timeArr = [];
  var api_url = null;

  if (item == 'avg_vrmsmax') {
    api_url = store.state.api.csvVrmsDownload
      .replace('%devid%', devid)
      .replace('%timerange%', timerange)
      .replace('%timeslot%', timeslot);
  } else {
    api_url = store.state.api.getAverage
      .replace('%devid%', devid)
      .replace('%item%', item)
      .replace('%timerange%', timerange)
      .replace('%timeslot%', timeslot);
  }

  var res = await axios(api_url);
  res.data.data.forEach(i => {
    dataArr.push(i[item].toFixed(2));
    if (timeslot === 'hour') {
      var datetime = new Date(i['timestamp_utc']);
      var date = datetime.toLocaleDateString();
      var time = datetime.getHours();
      var mid = 'pm';
      if (time < 12) {
        mid = 'am';
      }
      if (time > 12) {
        time = time - 12;
      }

      timeArr.push(`${time} ${mid}, ${date}`);
    }
    if (timeslot === 'day') {
      timeArr.push(new Date(i['timestamp_utc']).toLocaleDateString());
    }
    if (timeslot === 'week') {
      // week = end of the week
      let week = new Date(i['timestamp_utc']);
      // get start of week
      week.setDate(week.getDate() - 6);
      timeArr.push(
        week.toLocaleDateString() + ' - ' + new Date(i['timestamp_utc']).toLocaleDateString()
      );
    }
    if (timeslot === 'month') {
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ];

      timeArr.push(monthNames[new Date(i['timestamp_utc']).getMonth()]);
    }
  });

  chart.options.title.text = `${timerange} Averaged by ${timeslot}`.toUpperCase();
  chart.data.labels = timeArr;
  chart.data.datasets[0].data = dataArr;
  chart.update();
}

function timeGraphAPI(devid, totpts = 50) {
  var api_url = store.state.api.getValues.replace('%devid%', devid).replace('%totpts%', totpts);
  var timeDataValues;
  var id = motorIDs.indexOf(devid) + 1;

  axios(api_url)
    .then(res => {
      timeDataValues = res.data.data;
      plotTimeGraph(id, timeDataValues);
    })
    .catch(err => console.log(err));
}

function plotTimeGraph(id, data) {
  // initial data is not sorted by time
  data.sort((a, b) => b.timestamp_raw - a.timestamp_raw);
  var temperatureArr = [];
  var batteryArr = [];
  var powerArr = [];
  var timestampArr = [];

  data.forEach(cur => {
    temperatureArr.unshift(cur['temperature']);
    batteryArr.unshift(cur['battery']);
    powerArr.unshift(cur['power']);
    timestampArr.unshift(new Date(cur['timestamp_utc']).toLocaleString());
  });

  eval('lineChart_power_motor' + id).data.labels = timestampArr;
  eval('lineChart_power_motor' + id).data.datasets[0].data = powerArr;
  eval('lineChart_power_motor' + id).update();

  eval('lineChart_temperature_motor' + id).data.labels = timestampArr;
  eval('lineChart_temperature_motor' + id).data.datasets[0].data = temperatureArr;
  eval('lineChart_temperature_motor' + id).update();
}

function freqVrmsAPI(devid, totpts = 50) {
  var api_url = store.state.api.getVrmsValues.replace('%devid%', devid).replace('%totpts%', totpts);
  var values;
  var id = motorIDs.indexOf(devid) + 1;

  axios(api_url)
    .then(res => {
      values = res.data.data;
      plotVrmsGraph(id, values);
    })
    .catch(err => console.log(err));
}

function plotVrmsGraph(id, data) {
  // sort data by time
  data.sort((a, b) => b.timestamp_raw - a.timestamp_raw);
  var vrmsArr = [];
  var labelsArr = [];

  data.forEach(cur => {
    vrmsArr.unshift(cur['vrmsmax'].toFixed(2));
    labelsArr.unshift(
      cur['freq'].toFixed(2) + ' Hz at ' + new Date(cur['timestamp_utc']).toLocaleString()
    );
  });

  eval('lineChart_freq_vrms_motor' + id).data.labels = labelsArr;
  eval('lineChart_freq_vrms_motor' + id).data.datasets[0].data = vrmsArr;
  eval('lineChart_freq_vrms_motor' + id).update();
}

function updateCharts(devid, data) {
  const api_url = store.state.api.getLatestValue.replace('%devid%', devid);

  // on init() no data is passed
  if (!data) {
    axios(api_url)
      .then(res => {
        // use data to plot all graphs
        plotCharts(devid, res.data.data[0]);
      })
      .catch(err => console.log(err));
  }
  // plot data passed from getLatest
  else {
    plotCharts(devid, data);
  }
}

function plotCharts(devid, data) {
  const id = motorIDs.indexOf(devid) + 1;

  plotBatteryGauge(id, data['battery']);
  plotRSSIGauge(id, data['rssi']);
  plotFreqVsVrmsTable(id, data);
  plotFreqVsMagChart(id, data);
  timeGraphAPI(devid);
  freqVrmsAPI(devid);
  plotRingChart(id, data);

  motorState[id - 1].device_id = devid;
  motorState[id - 1].lastUpdate = data.timestamp_raw;
}

function plotBatteryGauge(id, data) {
  if (!data) return;

  eval('batteryGauge_motor' + id).data.datasets[0].value = data;
  eval('batteryGauge_motor' + id).update();
}

function plotRSSIGauge(id, data) {
  if (!data) return;

  // -50 dBm is #0f0
  // -80 to -50 is #ff0
  // -100 to -80 is #fa0
  // the rest is #f00
  if (data > -50) data = 87.5;
  else if (data > -80) data = 62.5;
  else if (data > -100) data = 37.5;
  else data = 12.5;

  eval('rssiGauge_motor' + id).data.datasets[0].value = data;
  eval('rssiGauge_motor' + id).update();
}

function plotFreqVsMagChart(id, data) {
  var magArr = [];
  var freqArr = [];
  var dataset = [];
  var datasetLabels = [];

  for (let i = 1; i < 11; i++) {
    magArr.push(eval(`data.mag${i}`));
    freqArr.push(eval(`data.freq${i}`));
  }

  for (var i = 0; i < magArr.length; i++) {
    dataset.push({ x: freqArr[i].toFixed(0), y: magArr[i].toFixed(2) });
  }

  // sort in ascending frequency
  dataset.sort((a, b) => {
    return a.x - b.x;
  });

  for (let i in dataset) {
    datasetLabels.push(dataset[i].x);
    // datasetLabels.push(dataset[i].x.toFixed(2));
  }

  eval('barChart_freq_mag_motor' + id).data.labels = datasetLabels;
  eval('barChart_freq_mag_motor' + id).data.datasets[0].data = dataset;
  eval('barChart_freq_mag_motor' + id).update();
}

function plotFreqVsVrmsTable(id, data) {
  var list = [];

  for (let i = 1; i < 11; i++) {
    list.push({
      vrms: eval('data.vrms' + i).toFixed(2),
      freq: eval('data.freq' + i).toFixed(2)
    });
  }

  // sorting by vrms
  list.sort(function(a, b) {
    return a.freq < b.freq ? -1 : a.freq == b.freq ? 0 : 1;
  });

  for (let i = 0; i < list.length; i++) {
    // selecting cells
    let vrmsCell = document.getElementById(`vrms-motor${id}-${i + 1}`);

    let freqCell = document.getElementById(`freq-motor${id}-${i + 1}`);

    vrmsCell.innerText = list[i].vrms;
    freqCell.innerText = list[i].freq;

    if (list[i].vrms < threshold.vrms_2) {
      vrmsCell.style.backgroundColor = 'limegreen';
      freqCell.style.backgroundColor = 'limegreen';
    } else if (list[i].vrms < threshold.vrms_3) {
      vrmsCell.style.backgroundColor = 'yellow';
      freqCell.style.backgroundColor = 'yellow';
    } else if (list[i].vrms < threshold.vrms_4) {
      vrmsCell.style.backgroundColor = 'orange';
      freqCell.style.backgroundColor = 'orange';
    } else {
      vrmsCell.style.backgroundColor = 'red';
      freqCell.style.backgroundColor = 'red';
    }
  }

  // check for critical value
  // get max Vrms
  let vrmsArr = [];
  list.forEach(cur => {
    vrmsArr.push(cur.vrms);
  });

  if (Math.max(...vrmsArr) > threshold.vrms_4) motorState[id - 1].vrmsCritical = true;
  else motorState[id - 1].vrmsCritical = false;

  // handle alerts
  motorStateAlert();
}

function motorStateAlert() {
  var alerts = 0;

  // count alerts
  for (var [id, cur] of motorState.entries()) {
    // for svg icon
    var svgWattIcon = document.getElementById(`svgMotorIcon-${id + 1}`).querySelector('.wattIcon');
    var svgBattIcon = document.getElementById(`svgMotorIcon-${id + 1}`).querySelector('.battIcon');
    var svgTempIcon = document.getElementById(`svgMotorIcon-${id + 1}`).querySelector('.tempIcon');
    var svgVibIcon = document.getElementById(`svgMotorIcon-${id + 1}`).querySelector('.vibIcon');

    if (cur.tempCritical) svgTempIcon.style.color = 'red';
    else svgTempIcon.style.color = 'transparent';

    if (cur.wattCritical) svgWattIcon.style.color = 'red';
    else svgWattIcon.style.color = 'transparent';

    if (cur.battCritical) svgBattIcon.style.color = 'red';
    else svgBattIcon.style.color = 'transparent';

    if (cur.vrmsCritical) svgVibIcon.style.color = 'red';
    else svgVibIcon.style.color = 'transparent';

    // for svg blinker
    var motorSVG = document
      .querySelector('.svg')
      .querySelector(`#motor${id + 1}`)
      .querySelectorAll('path');

    if (cur.battCritical || cur.tempCritical || cur.vrmsCritical || cur.wattCritical) {
      cur.alert = true;

      // blink SVG
      var blinkSVG = document.createElementNS('http://www.w3.org/2000/svg', 'animate');

      var motorColors = [
        'rgb(255, 255, 255)',
        'rgb(119, 119, 119)',
        'rgb(98, 98, 98)',
        'rgb(86, 86, 86)',
        'rgb(75, 75, 75)',
        'rgb(53, 53, 53)',
        'rgb(26, 26, 26)'
      ];

      for (let i = 0; i < motorSVG.length; i++) {
        blinkSVG.setAttribute('class', 'myAnimation');
        blinkSVG.setAttribute('attributeType', 'XML');
        blinkSVG.setAttribute('attributeName', 'fill');
        blinkSVG.setAttribute('values', `#f00;${motorColors[i]};#f00;`);
        blinkSVG.setAttribute('dur', '1.5s');
        blinkSVG.setAttribute('repeatCount', 'indefinite');

        // required to append to all children and not only the last one
        motorSVG[i].appendChild(blinkSVG.cloneNode(true));
      }
    } else {
      cur.alert = false;

      // remove svg blinker
      try {
        for (let i = 0; i < motorSVG.length; i++) {
          let anim = motorSVG[i].querySelector('.myAnimation');
          motorSVG[i].removeChild(anim);
        }
      } catch (e) {}
    }
    alerts += cur.alert;
  }

  // if not 0 alerts
  if (!!alerts) alarmPresent = true;
  checkAlarm();

  // update widget view
  document.querySelector('#numberOfAlerts').innerText = alerts;
}

function checkAlarm() {
  const audioEl = document.querySelector('audio');

  // if muted or no alarm present
  if (muteAlarm || !alarmPresent) {
    audioEl.muted = true;
  } else {
    audioEl.muted = false;
  }
}

async function customAverageGraph(devid, item, begindate, enddate, timeslot, chart) {
  var dataArr = [];
  var timeArr = [];
  var api_url = null;
  // convert string to object
  chart = eval(chart);

  if (item == 'avg_vrmsmax') {
    api_url = store.state.api.csvVrmsCustomDownload
      .replace('%devid%', devid)
      .replace('%begindate%', begindate)
      .replace('%enddate%', enddate)
      .replace('%timeslot%', timeslot);
  } else {
    api_url = store.state.api.customAverage
      .replace('%devid%', devid)
      .replace('%item%', item)
      .replace('%begindate%', begindate)
      .replace('%enddate%', enddate)
      .replace('%timeslot%', timeslot);
  }

  var res = await axios(api_url);
  var data = res.data;
  // console.log(data);

  if (data.data.length === 0) {
    alert(`No data found in the range ${begindate} to ${enddate} for Motor #${devid}.`);
  } else {
    data.data.forEach(i => {
      dataArr.push(i[item].toFixed(2));
      if (timeslot === 'hour') {
        var datetime = new Date(i['timestamp_utc']);
        var date = datetime.toLocaleDateString();
        var time = datetime.getHours();
        var mid = 'pm';
        if (time > 12) {
          time = time - 12;
        }
        if (time < 12) {
          mid = 'am';
        }

        timeArr.push(`${time} ${mid}, ${date}`);
      }
      if (timeslot === 'day') {
        timeArr.push(new Date(i['timestamp_utc']).toLocaleDateString());
      }
      if (timeslot === 'week') {
        let week = new Date(i['timestamp_utc']);
        week.setDate(week.getDate() + 7);
        timeArr.push(
          new Date(i['timestamp_utc']).toLocaleDateString() + ' - ' + week.toLocaleDateString()
        );
      }
      if (timeslot === 'month') {
        const monthNames = [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ];

        timeArr.push(monthNames[new Date(i['timestamp_utc']).getMonth()]);
      }
    });

    chart.options.title.text = `${begindate} to ${enddate} Averaged by ${timeslot}`.toUpperCase();
    chart.data.labels = timeArr;
    chart.data.datasets[0].data = dataArr;
    chart.update();
  }
}

// Status
var latestStatus = [];

function checkStatus(devid, num) {
  var api_url = store.state.api.getAlert.replace('%devid%', devid).replace('%num%', num);
  var id = motorIDs.indexOf(devid) + 1;
  var status_container = document.getElementById(`status-motor${id}`);

  axios(api_url)
    .then(res => {
      var val = res.data.data.reverse();
      val.forEach(i => {
        let datetime = new Date(i['timestamp_utc']);
        let html = `<div class="rows"><span class="${i['cur_level']}"></span><p>${
          i['message_key']
        }: ${i['parameter']} of Motor #${i['device_id']} has changed.</p><br><p class="value">${i[
          'prev_value'
        ].toFixed(2)} mm/s --> ${i['cur_value'].toFixed(
          2
        )} mm/s</p><p class="datetime">${datetime.toLocaleString()}</p></div>`;

        // insertHTML if new value =/= prev value
        if (latestStatus[id] !== i['timestamp_raw']) {
          // console.log(latestStatus[id], i['timestamp_raw']);
          status_container.insertAdjacentHTML('afterbegin', html);
          latestStatus[id] = i['timestamp_raw'];
        }
      });
    })
    .catch(err => console.log(err));
}

// download CSV
function downloadCSV(api_url, begin = '', endOri = '', fileNameSuffix, csvSelectedMotor) {
  axios(api_url)
    .then(res => {
      if (res.data.data.length === 0) {
        if (begin || alert)
          alert(`No data found in the range ${begin} to ${endOri} for Motor #${csvSelectedMotor}.`);
        else alert(`No data found for Motor #${csvSelectedMotor}.`);
      } else {
        try {
          const parser = new Parser(res.data.data);
          const csv = parser.parse(res.data.data);

          var downloadLink = document.createElement('a');
          var blob = new Blob(['\ufeff', csv]);
          var url = URL.createObjectURL(blob);
          downloadLink.href = url;
          downloadLink.download = `motor_${csvSelectedMotor}_${fileNameSuffix}.csv`;

          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          // console.log(csv);
        } catch (err) {
          console.error(err);
        }
      }
    })
    .catch(error => console.log('CSV Download Error:', error));
}
