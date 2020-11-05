import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import http from "./http/http";
import "@/assets/icons";
import "./utils/rem";
import "./style/resetui.scss";
import "video.js/dist/video-js.css";
import "videojs-contrib-hls";
import vueSwiper from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import VueLazyLoad from "vue-lazyload";

//IdoScroll  下拉刷新 上拉加载更多
import { InfiniteScroll  } from 'mint-ui'
import {
  Rate,
  NavBar,
  Button,
  Col,
  Row,
  Search,
  Tab,
  Tabs,
  Swipe,
  SwipeItem,
  Icon,
  PullRefresh,
  Loading,
  Sticky
} from "vant";
// axios 拦截器
import "./http/axios";
// 1.全局引用视频播放组件
import VideoPlayer from "vue-video-player";
Vue.use(VueLazyLoad);
Vue.use(VideoPlayer);
Vue.use(vueSwiper);
Vue.use(Rate);
Vue.use(Sticky);
Vue.use(Icon);
Vue.use(NavBar);
Vue.use(Button);
Vue.use(Col);
Vue.use(Row);
Vue.use(Search);
Vue.use(Tabs);
Vue.use(Tab);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(PullRefresh);
Vue.use(Loading);
Vue.use(InfiniteScroll);
import Router from 'vue-router'
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}
// 对请求方式 进行全局注册
Vue.prototype.$http = http;
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
