export default {
  error(state) {
    return state.error;
  },

  refreshToken(state) {
    return state.refresh;
  },

  accessToken(state) {
    return state.access;
  },

  isAdmin(state) {
    return !!state.isAdmin;
  }
};
