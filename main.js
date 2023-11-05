import Vue from 'vue'
import App from './App'
import './uni.promisify.adaptor'

Vue.config.productionTip = false
App.mpType = 'app'

new Vue({
  ...App
}).$mount()