<template>
  <div class="wrapContent" v-infinite-scroll="loadMore" infinite-scroll-distance="100">
    <div class="rank_tabs">
      <van-tabs
        background="#181827"
        title-active-color="#ff2152"
        :border="false"
        @click="tabHandle"
      >
        <van-tab v-for="(item,index) in filterTags" :title="item.code" :key="index">
          <div slot="title" class="tabwraps">
            <div class="tab_font">{{item.title}}</div>
          </div>
        </van-tab>
      </van-tabs>
    </div>
    <!-- 日榜，周榜，月榜 -->
    <div class="rankSorts">
      <span :class="isSpan==0?'selectSpan':''" @click="isSpanHandle(0)">日榜</span>
      <span :class="isSpan==1?'selectSpan':''" @click="isSpanHandle(1)">周榜</span>
      <span :class="isSpan==2?'selectSpan':''" @click="isSpanHandle(2)">月榜</span>
    </div>
    <!-- 排行榜内容 -->
    <div class="rankContent">
      <div
        class="rankItem"
        v-for="(item,index) in tabList"
        :key="index"
        @click.stop="goToplay(item)"
      >
        <div class="img">
          <img class="img" :src="item.h5_img" alt />
        </div>
        <div class="title" v-if="index!==0">{{item.title}}</div>
        <div class="topRank" v-if="index==0">TOP1</div>
        <div class="topRank" v-if="index==1">TOP2</div>
        <div class="topRank" v-if="index==2">TOP3</div>
      </div>
    </div>
    <div class="getMoreClass" v-if="showLoading">
      <p>加载中</p>
      <van-loading type="spinner" size="18px" v-show="showLoading" />
    </div>
    <div class="getMoreClass" v-else>
      <p>暂无更多</p>
    </div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar/index";
import {
  getWebTagsApi,
  getRecommendVideoApi,
  getTagVideosApi,
  getRankingDayApi,
  getRankingWeekApi,
  getRankingMonthApi,
  getFilterTagsApi
} from "@/apis/index";
export default {
  name: "ranking",
  props: {},
  components: {
    NavBar
  },
  data() {
    return {
      homeTags: [],
      filterTags: [],
      currentPage: 1,
      isSpan: 0,
      tabList: [],
      showLoading: true,
      hotNum: 0,
      hotNumW: 0,
      hotNumM: 0,
      hotSize: 5,
      showtype: 1
    };
  },
  created() {
    this.getFilterTagsHandle();
    // this.getRecommendVideoHandle();
  },
  methods: {
    goToplay(item) {
      this.$router.push({ name: "play", params: { videoUrl: item } });
    },
    loadMore() {
      this.showLoading = true;
      //官方示例中延迟了1秒，防止滚动条滚动时的频繁请求数据
      setTimeout(() => {
        console.log("load more");
        this.getLoadMore(this.showtype);
      }, 1000);
    },
    getLoadMore(n) {
      switch (n) {
        case 2:
          this.getRankingWeekHandle();
          break;
        case 3:
          this.getRankingMonthHandle();
          break;
        default:
          this.getRankingDayHandle();
          break;
      }
    },
    // 获取筛选标签
    getFilterTagsHandle() {
      this.$http.post(getFilterTagsApi, {}, false).then(result => {
        this.filterTags = result.Data.list_one;
        this.tagCode = this.filterTags[0].code;
        this.getRankingDayHandle();
      });
    },
    // 获取首页tabs标签
    // getTagsHandle() {
    //   this.$http.post(getWebTagsApi, {}, false).then(result => {
    //     this.homeTags = result.Data.list;
    //     this.tagCode = this.homeTags[0].tag_code;
    //   });
    // },
    // 切换tab获取对应内容
    tabHandle(name, title) {
      this.hotNum = 0;
      this.hotNumW = 0;
      this.hotNumM = 0;
      this.showLoading=true;
      this.currentPage = 1;
      this.isSpan = 0;
      this.tagCode = title;
      this.tabList = [];
      if (title == "recommend") {
        this.getRecommendVideoHandle();
      } else {
        this.getRankingDayHandle();
      }
    },
    // 获取推荐影片
    getRecommendVideoHandle(val) {
      this.$http
        .post(
          getRecommendVideoApi,
          { page: this.currentPage, page_size: "7" },
          false
        )
        .then(result => {
          if (result) {
            if (result.Status == 200 && result.Data) {
              this.tabList = result.Data.list;
            }
          }
        });
    },
    //根据tag的code获取对应影片
    // getTabVideoHandle(val) {
    //   this.$http
    //     .post(
    //       getTagVideosApi,
    //       { page: this.currentPage, page_size: "7", code: this.tagCode },
    //       false
    //     )
    //     .then(result => {
    //       if (result) {
    //         if (result.Status == 200 && result.Data) {
    //           this.tabList = result.Data.list;
    //         }
    //       }
    //     });
    // },
    isSpanHandle(n) {
      this.isSpan = n;
      this.tabList = [];
      this.hotNum = 0;
      this.hotNumW = 0;
      this.hotNumM = 0;
      this.showLoading = true;
      switch (n) {
        case 1:
          this.getRankingWeekHandle();
          this.showtype = 2;
          break;
        case 2:
          this.getRankingMonthHandle();
          this.showtype = 3;
          break;
        default:
          this.getRankingDayHandle();
          this.showtype = 1;
          break;
      }
    },
    // 获取日排行榜
    getRankingDayHandle() {
      this.hotNum++;
      this.$http
        .post(
          getRankingDayApi,
          {
            tag_code: this.tagCode,
            page: this.hotNum,
            page_size: this.hotSize
          },
          false
        )
        .then(result => {
          if (result) {
            if (result.Status == 200 && result.Data) {
              this.tabList.push.apply(this.tabList, result.Data.list);
              this.showLoading = false;
            }
          } else {
            this.showLoading = false;
          }
        });
    },
    // 获取周排行榜
    getRankingWeekHandle() {
      this.hotNumW++;
      this.$http
        .post(
          getRankingWeekApi,
          {
            tag_code: this.tagCode,
            page: this.hotNumW,
            page_size: this.hotSize
          },
          false
        )
        .then(result => {
          if (result) {
            if (result.Status == 200 && result.Data) {
              this.tabList.push.apply(this.tabList, result.Data.list);
              this.showLoading = false;
            }
          } else {
            this.showLoading = false;
          }
        });
    },
    // 获取月排行榜
    getRankingMonthHandle() {
      this.hotNumM++;
      this.$http
        .post(
          getRankingMonthApi,
          {
            tag_code: this.tagCode,
            page: this.hotNumM,
            page_size: this.hotSize
          },
          false
        )
        .then(result => {
          if (result) {
            if (result.Status == 200 && result.Data) {
              this.tabList.push.apply(this.tabList, result.Data.list);
              this.showLoading = false;
            }
          } else {
            this.showLoading = false;
          }
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.wrapContent {
  padding: 0px 22px 0px 35px;

  .navWrap {
    display: flex;
    align-items: center;
    padding-bottom: 40px;
    // border-bottom: 1px solid rgba($color: #fff, $alpha: 0.15);
    .navTitle {
      flex-grow: 1;
      font-size: 36px;
      color: #b7b7b9;
    }
  }
  .rank_tabs {
    margin-top: 20px;
    .tab_font {
      font-size: 0.5rem;
      margin-top: 17px;
    }
  }
  .rankContent {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .rankItem {
      position: relative;
      .topRank {
        position: absolute;
        width: 112px;
        height: 51px;
        right: 0px;
        top: 0px;
        line-height: 51px;
        background: #ff2152;
        font-size: 24px;
        color: #ffffff;
        border-bottom-left-radius: 0.6rem;
      }
    }
    div:nth-child(1) {
      width: 680px;
      margin-bottom: 20px;
      .img {
        display: block;
        width: 100%;
        height: 378px;
        border-radius: 12px;
      }
    }
    div:nth-child(n + 2) {
      width: 334px;
      margin-bottom: 20px;
      .img {
        display: block;
        width: 100%;
        height: 252px;
        border-radius: 6px;
      }
      .title {
        font-size: 30px;
        color: #c1c1c3;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
      }
    }
  }
  .rankSorts {
    width: 680px;
    height: 80px;
    margin: 30px 0px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 40px;
    display: flex;
    justify-content: space-between;
    span {
      display: block;
      width: 200px;
      height: 80px;
      line-height: 80px;
      text-align: center;
      font-size: 32px;
      color: #ffffff;
    }
    .selectSpan {
      background: #ff2152;
      border-radius: 40px;
      border-radius: 40px;
    }
  }
}
</style>
