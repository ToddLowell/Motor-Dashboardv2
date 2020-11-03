import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { FontAwesomeIcon } from './plugins/font-awesome';
import BaseButton from './components/ui/BaseButton.vue';
import BaseCard from './components/ui/BaseCard.vue';
import BaseDialog from './components/ui/BaseDialog.vue';
import BaseModal from './components/ui/BaseModal.vue';
import BaseSpinner from './components/ui/BaseSpinner.vue';
import VueSlideoutPanel from 'vue2-slideout-panel';
import PanelData from './components/workList/PanelData.vue';
import VueSnackbar from 'vue-snack';
import Dropdown from 'bp-vuejs-dropdown';

Vue.config.productionTip = false;

// event bus for dashboard navigation
export const eventBus = new Vue();

Vue.component('fa', FontAwesomeIcon);
Vue.component('base-button', BaseButton);
Vue.component('base-card', BaseCard);
Vue.component('base-dialog', BaseDialog);
Vue.component('base-modal', BaseModal);
Vue.component('base-spinner', BaseSpinner);
Vue.use(VueSlideoutPanel);
Vue.component('panelData', PanelData);
Vue.use(VueSnackbar, { position: 'bottom-left', time: 3000 });
Vue.component('dropdown', Dropdown);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
