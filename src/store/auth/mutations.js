export default {
  setUser(state, payload) {
    state.refresh = payload.refresh;
    state.access = payload.access;
    state.isAdmin = payload.isAdmin;
  },

  setError(state, payload) {
    state.error = payload.error;
  },

  setAccessToken(state, payload) {
    state.access = payload.access;
  }
};
