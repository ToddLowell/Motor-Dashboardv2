<template>
  <base-modal :open="true" @close="$emit('close')">
    <template #header>
      <h2 class="heading__secondary">Work Log Form</h2>
    </template>
    <template #default>
      <form id="workLogForm" enctype="multipart/form-data">
        <fa :icon="['fas', 'times']" class="close" @click="$emit('close')" />
        <label for="incident">Incident Number:</label>
        <input
          type="text"
          id="incident"
          name="incident"
          v-model="workLogIncidentID"
          required
        /><br />
        <label for="incident">Incident Time:</label>
        <datetime type="datetime" v-model="workLogIncidentTime" required></datetime><br />
        <label for="motorID">Motor ID:</label>
        <select name="motorID" id="motorIDList" v-model="workLogMotorID" required>
          <option v-for="(motorID, i) in motorIDs" :key="i">{{ motorID }}</option>
        </select>
        <br />
        <label for="issue">Described Issue:</label>
        <input type="text" id="issue" name="issue" v-model="workLogDescIssue" required /><br />
        <label for="action">Detail Observation:</label>
        <input type="text" id="action" name="action" v-model="workLogObservation" required /><br />
        <input type="text" id="username" v-model="workLogUsername" hidden />
        <vue-dropzone
          ref="myVueDropzone"
          id="dropzone"
          :options="dropzoneOptions"
          v-on:vdropzone-sending="sendingEvent"
        ></vue-dropzone>
        <input type="submit" id="submitWorkLogForm" class="btn--submit" />
      </form>
    </template>
  </base-modal>
</template>

<script>
import axios from '@/axios';

import BaseModal from './ui/BaseModal.vue';
import vue2Dropzone from 'vue2-dropzone';
import { Datetime } from 'vue-datetime';

var previewTemplate = `
<div class="dz-preview dz-file-preview">
  <div class="dz-image"><img data-dz-thumbnail /></div>
  <div class="dz-details">
    <div class="dz-size"><span data-dz-size></span></div>
    <div class="dz-filename"><span data-dz-name></span></div>
  </div>
  <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
  <div class="dz-error-message"><span data-dz-errormessage></span></div>
  <div class="dz-success-mark">
    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <title>Check</title>
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <path d="M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z" stroke-opacity="0.198794158" stroke="#747474" fill-opacity="0.816519475" fill="#FFFFFF"></path>
      </g>
    </svg>
  </div>
  <div class="dz-error-mark">
    <svg width="54px" height="54px" viewBox="0 0 54 54" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <title>Error</title>
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g stroke="#747474" stroke-opacity="0.198794158" fill="#FFFFFF" fill-opacity="0.816519475">
          <path d="M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z"></path>
        </g>
      </g>
    </svg>
  </div>
  <button class="removeFile" data-dz-remove>
    <span>Delete</span>
  </button>
</div>
`;

export default {
  components: {
    vueDropzone: vue2Dropzone,
    datetime: Datetime,
    BaseModal
  },
  props: {
    motorIDs: Array
  },
  data() {
    return {
      workLogIncidentID: '',
      workLogIncidentTime: '',
      workLogMotorID: '',
      workLogDescIssue: '',
      workLogObservation: '',
      workLogUsername: localStorage.getItem('username'),
      dropzoneOptions: {
        url:
          (process.env.VUE_APP_IP_ADDRESS == 'http://'
            ? `http://${location.host}`
            : process.env.VUE_APP_IP_ADDRESS) + this.$store.state.api.workLogList,
        paramName: 'attachments', // The name that will be used to transfer the file
        maxFilesize: 10, // MB
        maxFiles: 1,
        // maxFiles: 5,
        // parallelUploads: 5,
        thumbnailWidth: 80,
        thumbnailHeight: 80,
        previewTemplate: previewTemplate,
        autoProcessQueue: false,
        // uploadMultiple: true,
        // acceptedFiles: 'image/*, application/pdf',
        // acceptedFiles: ".jpeg,.jpg,.png",
        vueThis: this,
        init: function() {
          var vueClosure = this.options.vueThis;
          var dzClosure = this;

          // browser alert on error
          //   this.on('error', function (file, response) {
          //     alert(response);
          //   });

          function removeFiles() {
            dzClosure.removeAllFiles(true);
          }

          // for Dropzone to process the queue (instead of default form behavior):
          document.getElementById('submitWorkLogForm').addEventListener('click', function(e) {
            // prevent form submission and let Dropzone handle it
            e.preventDefault();
            e.stopPropagation();

            var form = document.getElementById('workLogForm');
            if (form.checkValidity()) {
              if (dzClosure.getQueuedFiles().length > 0) {
                dzClosure.processQueue();
              } else {
                // dzClosure.uploadFiles([]);
                vueClosure.submitForm();
              }
            } else {
              // form validation replacement
              var invalidFields = form.querySelectorAll(':invalid'),
                errorMessages = form.querySelectorAll('.error-message');

              // Remove any existing messages
              for (let i = 0; i < errorMessages.length; i++) {
                errorMessages[i].parentNode.removeChild(errorMessages[i]);
              }

              for (let i = 0; i < invalidFields.length; i++) {
                invalidFields[i].insertAdjacentHTML(
                  'afterend',
                  "<div class='error-message'>" + invalidFields[i].validationMessage + '</div>'
                );
              }

              // If there are errors, give focus to the first invalid field
              if (invalidFields.length > 0) {
                invalidFields[0].focus();
              }
            }
          });

          //send all the form data along with the files
          this.on('sending', function(data, xhr, formData) {
            // incident id is current date + random 5-digit hash
            var now = new Date();
            var incident_id = [
              now.getFullYear(),
              now.getMonth() < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1,
              now.getDate() < 10 ? '0' + now.getDate() : now.getDate(),
              now.getHours() < 10 ? '0' + now.getHours() : now.getHours(),
              now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes(),
              now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds(),
              '-',
              vueClosure.workLogIncidentID
            ].join('');

            var incident_date = vueClosure.workLogIncidentTime;

            var userid = vueClosure.workLogUsername;

            var motor_id = vueClosure.workLogMotorID;

            var issue_desc = vueClosure.workLogDescIssue;

            var observe_txt = vueClosure.workLogObservation;

            formData.append('incident_id', incident_id);
            formData.append('incident_date', incident_date);
            formData.append('userid', userid);
            formData.append('motor_id', motor_id);
            formData.append('issue_desc', issue_desc);
            formData.append('observe_txt', observe_txt);

            console.log(xhr, formData);
            console.log('Form submitted with attachment.');

            // Close Form
            vueClosure.closeForm();

            // Reset Fields
            vueClosure.workLogIncidentID = '';
            vueClosure.workLogIncidentTime = '';
            vueClosure.workLogMotorID = '';
            vueClosure.workLogDescIssue = '';
            vueClosure.workLogObservation = '';

            // remove files from dropzone
            removeFiles();

            // remove any existing messages
            var form = document.getElementById('workLogForm');
            var errorMessages = form.querySelectorAll('.error-message');

            for (var i = 0; i < errorMessages.length; i++) {
              errorMessages[i].parentNode.removeChild(errorMessages[i]);
            }
          });
        }
        // addedfile: function (file) {
        //   console.log(file);
        // },
      }
    };
  },
  methods: {
    sendingEvent(file, xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('accessToken')}`);
    },
    submitForm() {
      var now = new Date();
      var incident_id = [
        now.getFullYear(),
        now.getMonth() < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1,
        now.getDate() < 10 ? '0' + now.getDate() : now.getDate(),
        now.getHours() < 10 ? '0' + now.getHours() : now.getHours(),
        now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes(),
        now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds(),
        '-',
        this.workLogIncidentID
      ].join('');

      var incident_date = this.workLogIncidentTime;

      var userid = this.workLogUsername;

      var motor_id = this.workLogMotorID;

      var issue_desc = this.workLogDescIssue;

      var observe_txt = this.workLogObservation;

      axios
        .post(this.$store.state.api.workLogList, {
          incident_id: incident_id,
          incident_date: incident_date,
          userid: userid,
          motor_id: motor_id,
          issue_desc: issue_desc,
          observe_txt: observe_txt
        })
        .then(response => response.text())
        .then(result => {
          console.log('Form submitted without attachment.', result);
          // Close Form
          this.closeForm();

          // Reset Fields
          this.workLogIncidentID = '';
          this.workLogIncidentTime = '';
          this.workLogMotorID = '';
          this.workLogDescIssue = '';
          this.workLogObservation = '';

          // remove any existing messages
          var form = document.getElementById('workLogForm');
          var errorMessages = form.querySelectorAll('.error-message');

          for (var i = 0; i < errorMessages.length; i++) {
            errorMessages[i].parentNode.removeChild(errorMessages[i]);
          }
        })
        .catch(error => console.log('error', error));
    },
    closeForm() {
      this.$emit('close');
    }
  }
};
</script>
