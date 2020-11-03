import mutations from './mutations.js';
import actions from './actions.js';
import getters from './getters.js';

export default {
  state() {
    return {
      refresh: localStorage.getItem('refreshToken') || null,
      access: localStorage.getItem('accessToken') || null,
      isAdmin: 0,
      error: null
    };
  },
  mutations,
  actions,
  getters
};
