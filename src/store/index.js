import Vue from 'vue';
import Vuex from 'vuex';
import authModule from './auth';
import apiUrlModule from './apiUrls';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth: authModule,
    api: apiUrlModule
  },
  state() {
    return {
      motorIDs: [
        '2604198E',
        '26041C65',
        '260410A9',
        '260033',
        '260034',
        '260035',
        '260036',
        '260037',
        '260038',
        '260039',
        '260040'
      ]
    };
  },
  getters: {
    motorIDs(state) {
      return state.motorIDs;
    }
  }
});
