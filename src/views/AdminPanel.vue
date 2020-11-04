<template>
  <div class="container">
    <h1 class="title">Admin Panel</h1>
    <div class="back_button">
      <router-link :to="'/dashboard'"><fa :icon="['fas', 'home']"/></router-link>
    </div>

    <div class="adminPanelContainer">
      <div class="thresholds">
        <h2>Parameter Thresholds</h2>
        <h3 class="threshold__title">Temperature:</h3>
        <div class="threshold">
          <p>Min. Temperature:</p>
          <input type="text" v-model="tempMininimum" disabled />
          <fa :icon="['fas', 'pencil-alt']" @click="changeThresh" />
          <div class="threshold-confirm">
            <fa :icon="['fas', 'paper-plane']" @click="submitThresh" />
            <fa :icon="['fas', 'ban']" @click="cancelThresh" />
          </div>
        </div>
        <div class="threshold">
          <p>Satisfactory Temperature:</p>
          <input type="text" v-model="tempSatatisfactory" disabled />
          <fa :icon="['fas', 'pencil-alt']" @click="changeThresh" />
          <div class="threshold-confirm">
            <fa :icon="['fas', 'paper-plane']" @click="submitThresh" />
            <fa :icon="['fas', 'ban']" @click="cancelThresh" />
          </div>
        </div>
        <div class="threshold">
          <p>Unsatisfactory Temperature:</p>
          <input type="text" v-model="tempUnsatisfactory" disabled />
          <fa :icon="['fas', 'pencil-alt']" @click="changeThresh" />
          <div class="threshold-confirm">
            <fa :icon="['fas', 'paper-plane']" @click="submitThresh" />
            <fa :icon="['fas', 'ban']" @click="cancelThresh" />
          </div>
        </div>
        <div class="threshold">
          <p>Critical Temperature:</p>
          <input type="text" v-model="tempCritical" disabled />
          <fa :icon="['fas', 'pencil-alt']" @click="changeThresh" />
          <div class="threshold-confirm">
            <fa :icon="['fas', 'paper-plane']" @click="submitThresh" />
            <fa :icon="['fas', 'ban']" @click="cancelThresh" />
          </div>
        </div>
        <h3 class="threshold__title">Power:</h3>
        <div class="threshold">
          <p>Min. Power:</p>
          <input type="text" v-model="powerMininimum" disabled />
          <fa :icon="['fas', 'pencil-alt']" @click="changeThresh" />
          <div class="threshold-confirm">
            <fa :icon="['fas', 'paper-plane']" @click="submitThresh" />
            <fa :icon="['fas', 'ban']" @click="cancelThresh" />
          </div>
        </div>
        <div class="threshold">
          <p>Satisfactory Power:</p>
          <input type="text" v-model="powerSatistactory" disabled />
          <fa :icon="['fas', 'pencil-alt']" @click="changeThresh" />
          <div class="threshold-confirm">
            <fa :icon="['fas', 'paper-plane']" @click="submitThresh" />
            <fa :icon="['fas', 'ban']" @click="cancelThresh" />
          </div>
        </div>
        <div class="threshold">
          <p>Unsatisfactory Power:</p>
          <input type="text" v-model="powerUnsatisfactory" disabled />
          <fa :icon="['fas', 'pencil-alt']" @click="changeThresh" />
          <div class="threshold-confirm">
            <fa :icon="['fas', 'paper-plane']" @click="submitThresh" />
            <fa :icon="['fas', 'ban']" @click="cancelThresh" />
          </div>
        </div>
        <div class="threshold">
          <p>Critical Power:</p>
          <input type="text" v-model="powerCritical" disabled />
          <fa :icon="['fas', 'pencil-alt']" @click="changeThresh" />
          <div class="threshold-confirm">
            <fa :icon="['fas', 'paper-plane']" @click="submitThresh" />
            <fa :icon="['fas', 'ban']" @click="cancelThresh" />
          </div>
        </div>
        <h3 class="threshold__title">Battery:</h3>
        <div class="threshold">
          <p>Critical Battery:</p>
          <input type="text" value="25%" disabled />
          <!-- invisible icon for alignment -->
          <fa :icon="['fas', 'pencil-alt']" style="opacity: 0" />
        </div>
        <h3 class="threshold__title">Vrms:</h3>
        <div class="threshold">
          <p>Critical Vrms:</p>
          <input type="text" value="4.50 mm/s" disabled />
          <!-- invisible icon for alignment -->
          <fa :icon="['fas', 'pencil-alt']" style="opacity: 0" />
        </div>
      </div>
      <div class="users">
        <h2>Manage Users</h2>
        <div class="usersList">
          <h3 class="users__sub-title">All Users:</h3>
          <div class="usersList--row header">
            <p>ID</p>
            <p>Username</p>
            <p>Name</p>
            <p>Role</p>
            <p>Password</p>
            <p>Action</p>
          </div>
          <div class="usersList--row" v-for="(user, i) in users" :key="i">
            <input type="text" v-model="user.user_id" disabled />
            <input
              type="text"
              v-model="user.username"
              disabled
              :data-id="user.user_id"
              class="username"
            />
            <input type="text" v-model="user.name" disabled :data-id="user.user_id" class="name" />
            <!-- <input type="text" v-model="user.role" disabled :data-id="user.user_id" class="role" /> -->
            <select v-model="user.role" disabled :data-id="user.user_id" class="role">
              <option v-for="role in availableRoles" :value="role" :key="role">{{ role }}</option>
            </select>
            <input
              type="text"
              value="***********"
              disabled
              :data-id="user.user_id"
              class="password"
            />
            <input
              type="text"
              v-model="user.password"
              :data-id="user.user_id"
              style="display: none"
              class="passwordOri"
            />
            <div class="userActions">
              <fa :icon="['fas', 'pencil-alt']" @click="confirmEdit" :data-id="user.user_id" />
              <fa :icon="['fas', 'trash-alt']" @click="confirmDelete" :data-id="user.user_id" />
            </div>
            <div class="delConfirm">
              <button class="confirm-delete" :data-id="user.user_id" @click="deleteUser">
                Comfirm
              </button>
              <button class="cancel-delete" :data-id="user.user_id" @click="cancelAction">
                Cancel
              </button>
            </div>
            <div class="editConfirm">
              <button class="confirm-edit" :data-id="user.user_id" @click="editUser">
                Comfirm
              </button>
              <button class="cancel-edit" :data-id="user.user_id" @click="cancelAction">
                Cancel
              </button>
            </div>
          </div>
        </div>
        <div class="usersAdd">
          <h3 class="users__sub-title">Add Users:</h3>
          <form class="addUserForm" :action="registration" method="POST">
            <div>
              <label for="username">Username:</label>
              <input type="text" name="username" required />
            </div>
            <div>
              <label for="password">Password:</label>
              <input type="password" name="password" required />
            </div>
            <div>
              <label for="name">Name:</label>
              <input type="text" name="name" required />
            </div>
            <div>
              <label for="role">Role:</label>
              <select name="role" required>
                <option v-for="role in availableRoles" :value="role" :key="role">{{ role }}</option>
              </select>
            </div>
            <button class="btn--add-user" @click.prevent="addUser">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '@/axios';

export default {
  data() {
    return {
      users: [],
      availableRoles: ['admin', 'user'],
      registration: this.$store.state.api.addUser,
      tempMininimum: '-',
      tempSatatisfactory: '-',
      tempUnsatisfactory: '-',
      tempCritical: '-',
      powerMininimum: '-',
      powerSatistactory: '-',
      powerUnsatisfactory: '-',
      powerCritical: '-'
    };
  },
  methods: {
    addUser() {
      // return if form is not valid
      if (!document.querySelector('.addUserForm').checkValidity()) {
        var invalidFields = document.querySelector('.addUserForm').querySelectorAll(':invalid');

        invalidFields.forEach(cur => {
          cur.style.boxShadow = '0 0 0 2px red';
          setTimeout(() => {
            cur.style.boxShadow = 'none';
          }, 500);
        });
        return;
      }

      axios
        .post(this.$store.state.api.addUser, {
          username: document.querySelector('[name="username"]').value,
          password: document.querySelector('[name="password"]').value,
          name: document.querySelector('[name="name"]').value,
          role: document.querySelector('[name="role"]').value
        })
        .then(res => {
          console.log(res.data);
          // clear fields
          document.querySelector('[name="username"]').value = '';
          document.querySelector('[name="password"]').value = '';
          document.querySelector('[name="name"]').value = '';

          // update list of all users
          axios.get(this.$store.state.api.userList).then(res => (this.users = res.data.users));

          this.snackBarMsg('User Added');
        })
        .catch(error => {
          console.log('error', error);
          this.snackBarError();
        });
    },
    confirmDelete(e) {
      const el = e.target.closest('svg');
      let id = el.dataset.id;

      el.parentNode.style.display = 'none';

      document.querySelector(`button.confirm-delete[data-id="${id}"]`).parentNode.style.display =
        'flex';
    },
    deleteUser(e) {
      const el = e.target;
      let id = el.dataset.id;

      axios
        .delete(this.$store.state.api.deleteUser.replace('%id%', id))
        .then(result => {
          console.log(result);

          // close buttons
          this.cancelAction(e);

          // update list of all users
          axios.get(this.$store.state.api.userList).then(res => {
            this.users = res.data.users;
            this.snackBarMsg('User Deleted');
          });
        })
        .catch(error => {
          console.log('error', error);
          this.snackBarError();
        });
    },
    async editUser(e) {
      const el = e.target;
      let id = el.dataset.id;

      let password = document.querySelector(`input.password[data-id="${id}"]`).value;

      // if password is unchanged then pass old password
      if (password === '***********') {
        password = document.querySelector(`input.passwordOri[data-id="${id}"]`).value;
      }
      // else hash new password
      else {
        var FormData = require('form-data');
        var data = new FormData();
        data.append('password', password);

        var config = {
          method: 'post',
          url: this.$store.state.api.passwordHash,
          data: data
        };

        var res = await axios(config);
        console.log(res);
        password = res.data['pbkdf2-sha256'];
        // console.log(result['pbkdf2-sha256']);
      }

      // edit via api
      axios
        .post(this.$store.state.api.updateUser.replace('%id%', id), {
          username: document.querySelector(`input.username[data-id="${id}"]`).value,
          password: password,
          role: document.querySelector(`select.role[data-id="${id}"]`).value,
          name: document.querySelector(`input.name[data-id="${id}"]`).value
        })
        .then(res => {
          console.log(res.data);

          axios.get(this.$store.state.api.userList).then(res => (this.users = res.data.users));

          document.querySelector(`input.password[data-id="${id}"]`).value = '***********';
          this.snackBarMsg('User Edited');
        })
        .catch(error => {
          console.log('error', error);
          this.snackBarError();
        });

      // // close buttons
      this.cancelAction(e);
    },
    confirmEdit(e) {
      const el = e.target.closest('svg');
      let id = el.dataset.id;

      el.parentNode.style.display = 'none';

      document.querySelector(`button.confirm-edit[data-id="${id}"]`).parentNode.style.display =
        'flex';

      // make input fields enabled
      let textFields = document.querySelectorAll(`input[data-id="${id}"], select[data-id="${id}"]`);
      textFields.forEach(cur => (cur.disabled = false));
    },
    cancelAction(e) {
      const el = e.target;
      let id = el.dataset.id;

      document.querySelector(`svg[data-id="${id}"]`).parentNode.style.display = 'block';

      el.parentNode.style.display = 'none';

      // make input fields disabled
      let textFields = document.querySelectorAll(`input[data-id="${id}"], select[data-id="${id}"]`);
      textFields.forEach(cur => (cur.disabled = true));

      // reset password filler
      document.querySelector(`input.password[data-id="${id}"]`).value = '***********';
    },
    changeThresh(e) {
      const el = e.target.closest('svg');
      el.previousSibling.disabled = false;
      el.nextSibling.style.display = 'block';
      el.style.display = 'none';
    },
    cancelThresh(e) {
      const el = e.target.closest('svg');
      el.parentNode.style.display = 'none';
      el.parentNode.previousSibling.style.display = 'block';
      el.parentNode.previousSibling.previousSibling.disabled = true;
    },
    submitThresh(e) {
      axios
        .post(this.$store.state.api.threshold, {
          tempMininimum: this.tempMininimum,
          tempSatatisfactory: this.tempSatatisfactory,
          tempUnsatisfactory: this.tempUnsatisfactory,
          tempCritical: this.tempCritical,
          powerMininimum: this.powerMininimum,
          powerSatistactory: this.powerSatistactory,
          powerUnsatisfactory: this.powerUnsatisfactory,
          powerCritical: this.powerCritical
        })
        .then(res => {
          console.log(res.data);
          this.snackBarMsg('Threshold Updated');
        })
        .catch(error => {
          console.log('error', error);
          this.snackBarError();
        });

      // close field
      this.cancelThresh(e);
    },
    snackBarMsg(message) {
      this.$snack.success({
        text: message,
        button: 'Close'
        // action: this.clickAction
      });
    },
    snackBarError() {
      this.$snack.danger({
        text: 'Something Went Wrong',
        button: 'Close'
      });
    }
  },
  created() {
    // get all users
    axios.get(this.$store.state.api.userList).then(res => {
      this.users = res.data.users;
    });

    // get thresholds
    axios.get(this.$store.state.api.threshold).then(res => {
      const data = res.data;
      this.tempMininimum = data.tempMininimum;
      this.tempSatatisfactory = data.tempSatatisfactory;
      this.tempUnsatisfactory = data.tempUnsatisfactory;
      this.tempCritical = data.tempCritical;
      this.powerMininimum = data.powerMininimum;
      this.powerSatistactory = data.powerSatistactory;
      this.powerUnsatisfactory = data.powerUnsatisfactory;
      this.powerCritical = data.powerCritical;
    });
  }
};
</script>
