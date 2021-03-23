import Vue from 'vue';
import 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Gravatar from 'vue-gravatar';
import Messages from './components/messages/index.vue';
import Modal from './components/modal/index.vue';
import Pagination from './components/pagination/index.vue';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.component('v-gravatar', Gravatar);
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('Messages', Messages);
Vue.component('Modal', Modal);
Vue.component('Pagination', Pagination);



Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
