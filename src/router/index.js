import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "",
      index: 100
    }
  },
  {
    path: "/detail",
    name: "detail",
    component: () => import("../views/DetailInfo.vue"),
    meta: {
      title: "",
      index: 0,
      isBack: false
    }
  },
  {
    path: "/play",
    name: "play",
    component: () => import("../views/PlayVideo.vue"),//视频播放页
    meta: {
      title: "",
      index: 0,
      isBack: false
    }
  },
  {
    path: "/playL",
    name: "playL",
    component: () => import("../views/PlayVideoL.vue"),//视频播放页，防止在当前页面刷新，做了个中转页面
    meta: {
      title: "",
      index: 0,
      isBack: false
    }
  },
  {
    path: "/featureinfo",
    name: "featureinfo",
    component: () => import("@/views/FeatureInfo.vue"),//专题详情
    meta: {
      title: "",
      index: 0,
      isBack: false
    }
  },
  // {
  //   path: "/rankList",
  //   name: "rankList",
  //   component: () => import("../views/RankList.vue"),//排行榜
  //   meta: {
  //     title: "",
  //     index: 4,
  //     isBack: false
  //   }
  // },
  {
    path: "/avAdols",
    name: "avAdols",
    component: () => import("../views/AvAdols.vue"),//女优列表
    meta: {
      title: "",
      index: 5,
      isBack: false
    }
  },
  {
    path: "/searchResult",
    name: "searchResult",
    component: () => import("../views/SearchResult.vue"),//搜索结果
    meta: {
      title: "",
      index: 80,
      isBack: false
    }
  },
  {
    path: "/searchList",
    name: "searchList",
    component: () => import("../views/SearchList.vue"),//搜索结果
    meta: {
      title: "",
      index: 10,
      isBack: false
    }
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
