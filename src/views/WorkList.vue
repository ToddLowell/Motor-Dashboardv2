<template>
  <div class="container">
    <h1 class="title">Work List</h1>
    <div class="back_button">
      <router-link :to="'/dashboard'"><fa :icon="['fas', 'home']"/></router-link>
    </div>

    <div class="table__container">
      <div class="table__wrapper">
        <table role="table" class="table__content">
          <thead role="rowgroup">
            <tr role="row header" class="table__header">
              <th role="columnheader" class="table__cell">Incident ID</th>
              <th role="columnheader" class="table__cell">User ID</th>
              <th role="columnheader" class="table__cell">Motor ID</th>
              <th role="columnheader" class="table__cell">Observation</th>
              <th role="columnheader" class="table__cell">Described Issue</th>
              <th role="columnheader" class="table__cell">Attachments?</th>
            </tr>
          </thead>
          <tbody role="rowgroup" class="table__data">
            <tr
              role="row"
              v-for="(workLog, i) in workLogs"
              :key="i"
              class="table__row"
              @click="showPanel(workLog, link)"
            >
              <td role="cell" class="table__cell">{{ workLog.incident_id }}</td>
              <td role="cell" class="table__cell">{{ workLog.userid }}</td>
              <td role="cell" class="table__cell">{{ workLog.motor_id }}</td>
              <td role="cell" class="table__cell">{{ workLog.observe_txt }}</td>
              <td role="cell" class="table__cell">{{ workLog.issue_desc }}</td>
              <td role="cell" class="table__cell">
                {{ workLog.attachments.length > 0 ? 'Yes' : 'No' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <slideout-panel></slideout-panel>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  data() {
    return {
      workLogs: [],
      link: this.$store.state.api.workLogList
    };
  },
  async created() {
    axios(this.$store.state.api.workLogList)
      .then(res => {
        console.log(res.data.data);
        this.workLogs.push(...res.data.data);
      })
      .catch(err => console.log(err));
  },
  methods: {
    showPanel(data, link) {
      const panelHandle = this.$showPanel({
        component: 'panel-data',
        openOn: 'left',
        cssClass: 'slideWorkList',
        props: {
          data: data,
          link: link
        }
      });

      panelHandle.promise.then(res => console.log(res));
    }
  }
};
</script>
