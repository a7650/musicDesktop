import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import 'common/less/index.less'
import float from "base/float/float"

// Vue.prototype.$eventBus = new Vue()

Vue.config.productionTip = false




Vue.component('float', float)

Vue.mixin({
  mounted() {
    if (this.$refs.float)
      this.float = this.$refs.float.float
    }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

