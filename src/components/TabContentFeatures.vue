<template>
  <div class="featureWrap">
    <div class="scroller" ref="scroller">
      <div class="scroll-list">
        <p class="likeClass likeClass1">
          <span class="span"></span>
          热门专题
        </p>
        <!-- 热门专题内容 -->
        <div class="featureContent">
          <div
            class="featureItem"
            v-for="(item,index) in hotFeatures"
            :key="index"
            @click="goToplay(item)"
          >
            <div class="imgbox">
              <img :src="item.tag_img" alt />
            </div>
            <div class="vtitle" @click="goToplay(item)">{{item.tag_title}}</div>
          </div>
        </div>
        <div class="loading">
         
          <div class="getMoreClass" v-if="showLoading">
            <p>加载中</p>
            <van-loading type="spinner" size="18px" v-show="showLoading" />
          </div>
          <div class="getMoreClass" v-else>
            <p>暂无更多</p>
          </div>
        </div>
      </div>
    </div>
    <Advert :adItem="AdList[0]"></Advert>
  </div>
</template>

<script>
import Advert from "@/components/advert.vue";
import Swipers from "@/components/Swipers/index";
import BScroll from "better-scroll";
import { setSessionStorage, getSessionStorage } from "@/utils/tools.js";
import {
  getHotFeaturesApi,
  getBannerListApi,
  getAdListApi
} from "@/apis/index";
export default {
  name: "TabContent",
  props: {
    childProps: Array
  },
  components: {
    Advert,
    Swipers
  },
  data() {
    return {
      BannerList: [],
      AdList: [],
      hotFeatures: [],
      showLoading: false,
      hotTagNum: 0,
      hotTagSize: 3,
      loadingText: ""
    };
  },
  created() {
    // this.getBannerListHandle();
    this.getHotFeaturesHandle();
    this.getAdListHandle();
  },
  mounted() {
    this.initScroller();
  },
  methods: {
    initScroller() {
      //初始化betterScroll
      let self = this;
      self.scroller = new BScroll(self.$refs.scroller, {
        probeType: 1,
        click: true,
        pullUpLoad: {
          threshold: 10 //当上拉距离超过盒子高度的10px的时候,就派发一个上拉加载的事件
        }
      });
      self.scroller.on("pullingUp", function() {
        //上拉加载事件
        self.loadingText = "加载中...";
        console.log(self.isNoMore);
        self.getHotFeaturesHandle();
        self.scroller.finishPullUp(); //可以多次执行上拉加载，没有这段代码上拉只会加载一次
      });
      self.scroller.refresh();
      // self.scroller.on("touchend", function(position) {
      //   console.log(position.y);
      //   console.log(222);
      //   if (position.y < this.maxScrollY - 30) {
      //     // 上拉加载
      //     if (self.isNoMore) return (self.loadingText = "没有更多了...");
      //     self.loadingText = "加载中...";
      //     setTimeout(function() {
      //       self.getList();
      //     }, 1000);
      //   }
      //   if (position.y > 80) {
      //     // 下拉刷新
      //     self.list.length = 0;
      //     self.loadingText = "刷新中...";
      //     setTimeout(function() {
      //       self.getList();
      //     }, 1000);
      //   }
      // });
    },
    getList() {
      this.initScroller();
      console.log("mmmm");
      this.$nextTick(() => {
        this.loadingText = "上拉加载";
        if (this.isNoMore) {
          this.loadingText = "没有更多了...";
        }
        this.scroller ? this.scroller.refresh() : this.initScroller();
      });
    },
    loadMore() {
      this.showLoading = true;
      //官方示例中延迟了1秒，防止滚动条滚动时的频繁请求数据
      setTimeout(() => {
        this.getHotFeaturesHandle();
      }, 1000);
    },
    // 获取热门专题
    getHotFeaturesHandle() {
      this.hotTagNum++;
      console.log(this.hotTagNum);
      this.$http
        .post(
          getHotFeaturesApi,
          { page: this.hotTagNum, page_size: this.hotTagSize },
          false
        )
        .then(result => {
          if (result) {
            if (result.Status == 200 && result.Data) {
              this.hotFeatures.push.apply(this.hotFeatures, result.Data.list);
              this.showLoading = false;
            }
          } else {
            this.showLoading = false;
          }
        });
    },
    // 获取广告
    getAdListHandle() {
      this.$http.post(getAdListApi, {}, false).then(result => {
        if (result) {
          if (result.Status == 200 && result.Data) {
            setSessionStorage("AdList", result.Data.list);
            this.AdList = result.Data.list;
          }
        }
      });
    },
    goToplay(item) {
      setSessionStorage("projectcode", item.tag_code);
      setSessionStorage("projectImg", item.tag_img);
      setSessionStorage("projectTitle", item.tag_title);
      this.$router.push({
        name: "featureinfo",
        params: {
          code: item.tag_code,
          tag_img: item.tag_img,
          title: item.tag_title
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.featureWrap {
  padding-bottom: 40px;

  .scroller {
    border: 1px solid red;
    height: 900px;
    overflow: hidden;
    margin-bottom: 20px;
  }

  .featureContent {
    width: 680px;
    margin: 0 auto;
    margin-top: 30px;
    .featureItem {
      margin-bottom: 30px;
      margin-right: 8px;
      position: relative;
      .imgbox {
        opacity: 0.7;
        background: #181827;
        img {
          display: block;
          width: 100%;
          height: 360px;
          border-radius: 10px;
          border: 1px solid transparent;
        }
      }
      .vtitle {
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        font-weight: bold;
        font-size: 60px;
        color: #ffffff;
        position: absolute;
      }
    }
  }
}
</style>
