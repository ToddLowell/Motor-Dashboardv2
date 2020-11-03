<template>
  <div>
    <div>
      <p class="slideWorkList--title">Motor ID:</p>
      <p class="slideWorkList--subtitle">{{ data.motor_id }}</p>
    </div>
    <div>
      <p class="slideWorkList--title">User ID:</p>
      <p class="slideWorkList--subtitle">{{ data.userid }}</p>
    </div>
    <div>
      <p class="slideWorkList--title">Incident ID:</p>
      <p class="slideWorkList--subtitle">{{ data.incident_id }}</p>
    </div>
    <div>
      <p class="slideWorkList--title">Observed Details:</p>
      <p class="slideWorkList--subtitle">{{ data.observe_txt }}</p>
    </div>
    <div>
      <p class="slideWorkList--title">Described Issue:</p>
      <p class="slideWorkList--subtitle">{{ data.issue_desc }}</p>
    </div>
    <div v-if="data.attachments.length > 0">
      <p class="slideWorkList--title">Attachment:</p>
      <br />
      <div id="attachmentPlaceholder"></div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    link: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      //
    };
  },
  methods: {
    closePanel() {
      this.$emit('closePanel', {});
    }
  },
  async mounted() {
    // DOM elements to be inserted containing atachment
    var DOMels;
    var attachmentPlaceholder = document.getElementById('attachmentPlaceholder');

    try {
      var res = await axios.get(`${this.link}?attachment_id=${this.data.attachments[0].id}`, {
        responseType: 'blob'
      });
      var blob = new File([res.data], this.data.attachments[0].filename, {
        type: this.data.attachments[0].filetype
      });
      console.log(blob);
      //   var blob = new Blob([res.data], {
      //     type: this.data.attachments[0].filetype
      //   });
      //   var blob = await res.data.blob();
      //   console.log(res.data, blob);

      if (this.data.attachments[0].filetype.includes('pdf')) {
        DOMels = `<iframe id="attachmentFile" width="100%" height="500px" />`;
        attachmentPlaceholder.insertAdjacentHTML('afterbegin', DOMels);
        document.getElementById('attachmentFile').src = URL.createObjectURL(blob);
      } else if (this.data.attachments[0].filetype.includes('image')) {
        DOMels = `<img id="attachmentFile" style="max-width: 100%;" />`;
        attachmentPlaceholder.insertAdjacentHTML('afterbegin', DOMels);
        document.getElementById('attachmentFile').src = URL.createObjectURL(blob);
      } else {
        DOMels = `
          <div class="attachment__container">
            <a id="attachmentFile"  class="attachment__link">
              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-download" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path fill-rule="evenodd" d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
              </svg> &nbsp; ${this.data.attachments[0].filename}
            </a>
            <p class="attachment__detail">${this.data.attachments[0].filesize} bytes</p>
          </div>
          `;
        attachmentPlaceholder.insertAdjacentHTML('afterbegin', DOMels);
        document.getElementById('attachmentFile').href = URL.createObjectURL(blob);
      }
    } catch (e) {
      console.log(e);
    }
  }
};
</script>
