import Vue from 'vue'
import App from './App.vue'
import Axios from 'axios';

Vue.config.productionTip = false
Object.defineProperty(Vue.prototype, 'axios', { value: Axios });

new Vue({
  render: h => h(App)
}).$mount('#app')
