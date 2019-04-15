import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'
import 'common/less/index.less'


Vue.config.productionTip = false

Vue.prototype.filterSrc=function(val,src){
 if(!src){
  return `<del>${val}(暂无音源)</del>`;
 }else{
   return val
 }
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
