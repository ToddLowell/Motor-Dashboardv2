import axios from 'axios';

import router from '@/router';
import store from '@/store';

// NOTE: dont't set the global axios header like this as it gets hardcoded
// axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`;

let instance = axios.create({
  baseURL: process.env.VUE_APP_IP_ADDRESS
});

// set axios interceptor for header
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// set axios interceptor for error handling
instance.interceptors.response.use(
  response => response,
  error => {
    // global error handling for 401 unauthorized
    // if not 401 error then redirect to '/'
    if (error.response.status == 401) {
      console.log('Refreshing Access Token');
      axios
        .post(store.state.api.refreshToken, null, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('refreshToken')}`
          }
        })
        .then(res => {
          localStorage.setItem('accessToken', res.data.access_token);
        })
        .catch(err => {
          console.log('Failed to Refresh Access Token', err);
          router.push('/');
        });
    } else {
      console.log('Error Occured with JWT.');
      localStorage.clear();
      router.push('/');
      return Promise.reject(error);
    }
  }
);

export default instance;
