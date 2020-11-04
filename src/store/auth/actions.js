import axios from 'axios';
import router from '@/router';
import store from '@/store';

axios.defaults.baseURL = process.env.VUE_APP_IP_ADDRESS;

// automatic logout timer
let timer;
let refresh;

export default {
  login(context, payload) {
    const username = payload.username;
    const password = payload.password;

    return axios
      .post(store.state.api.login, {
        username,
        password
      })
      .then(res => {
        // if valid
        if (res.data.access_token) {
          const isAdmin = res.data.role == 'admin' ? 1 : 0;

          context.commit('setUser', {
            refresh: res.data.refresh_token,
            access: res.data.access_token,
            isAdmin
          });

          // refresh access token every 10 mins
          refresh = setInterval(() => {
            context.dispatch('refreshToken');
          }, 600000);

          // expires in 30d
          const tokenExpiresIn = 2592000000;
          const tokenExpiration = new Date().getTime() + tokenExpiresIn;

          localStorage.setItem('refreshToken', res.data.refresh_token);
          localStorage.setItem('accessToken', res.data.access_token);
          localStorage.setItem('tokenExpiration', tokenExpiration);
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);

          // automatic logout
          timer = setTimeout(() => {
            clearInterval(refresh);
            context.dispatch('logout');
          }, tokenExpiration);

          // // redirect
          router.replace('/dashboard');
          // location.reload();
        } else {
          context.commit('setError', { error: res.data.message });
        }
      })
      .catch(err => {
        // if not http error then provide error message
        try {
          context.commit('setError', {
            error: `Error ${err.response.status}: ${err.response.data}.`
          });
        } catch {
          context.commit('setError', {
            error: `Error Occured: ${err.message}.
            Please Try Again Later.`
          });
        }

        localStorage.clear();
      });
  },
  autoLogin(context) {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    const tokenExpiration = localStorage.getItem('tokenExpiration');
    const tokenExpiresIn = tokenExpiration - new Date().getTime();

    localStorage.clear();

    // if expired or no username/password
    if (tokenExpiresIn < 0 && tokenExpiration != null) {
      router.replace('/');
      return;
    }

    if (username == null || password == null) return;

    return axios
      .post(store.state.api.login, {
        username,
        password
      })
      .then(res => {
        // if valid
        if (res.data.access_token) {
          const isAdmin = res.data.role == 'admin' ? 1 : 0;

          context.commit('setUser', {
            refresh: res.data.refresh_token,
            access: res.data.access_token,
            isAdmin
          });

          // refresh access token every 10 mins
          refresh = setInterval(() => {
            context.dispatch('refreshToken');
          }, 600000);

          // expires in 30d
          const tokenExpiresIn = 2592000000;
          const tokenExpiration = new Date().getTime() + tokenExpiresIn;

          localStorage.setItem('refreshToken', res.data.refresh_token);
          localStorage.setItem('accessToken', res.data.access_token);
          localStorage.setItem('tokenExpiration', tokenExpiration);
          localStorage.setItem('username', username);
          localStorage.setItem('password', password);

          // automatic logout
          timer = setTimeout(() => {
            clearInterval(refresh);
            context.dispatch('logout');
          }, tokenExpiration);

          router.replace('/dashboard');
        }
      })
      .catch(() => {
        localStorage.clear();
        // redirect
        router.replace('/');
      });
  },
  refreshToken(context) {
    const refreshToken = context.getters.refreshToken;
    console.log('Refreshing Access Token.');

    axios
      .post(store.state.api.refreshToken, null, {
        headers: {
          Authorization: `Bearer ${refreshToken}`
        }
      })
      .then(res => {
        const accessToken = res.data.access_token;

        localStorage.setItem('accessToken', accessToken);
        context.commit('setAccessToken', { accessToken });
      })
      .catch(err => {
        console.log('Failed to Refresh Access Token', err);
        context.dispatch('logout');
      });
  },
  logout(context) {
    context.commit('setUser', {
      refresh: null,
      access: null,
      isAdmin: 0
    });

    localStorage.clear();

    clearTimeout(timer);

    // redirect
    router.push('/');
  }
};
