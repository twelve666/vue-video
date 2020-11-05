<template>
  <div class="home">
    <BaseLayer :showLoad="showLoading">
      <!-- 头部插槽 -->
      <template v-slot:header>
        <!-- 头部 -->
        <div class="home_top">
          <span class="top_left" @click="openChannel">
            <svg-icon v-if="channelBoolen" class="chan_open" icon-class="icon_ Chan_open" />
            <svg-icon v-if="!channelBoolen" class="chan_open" icon-class="icon_Chan_close" />
          </span>
          <span class="top_mid">
            <van-search
              v-if="showSearch"
              v-model="searchValue"
              shape="round"
              background="#181827"
              placeholder="请输入搜索关键词"
              @focus="jumpToSearch"
            />
            <span v-if="!showSearch" class="logo" @click="gotoHomeHandle">
              <svg-icon class="iocn_logo" icon-class="iocn_logo" />
            </span>
          </span>
          <span class="top_right" @click="changeSerach">
            <svg-icon v-if="!showSearch" class="icon_del" icon-class="icon_seach_small" />
            <svg-icon v-if="showSearch" class="icon_del" icon-class="icon_delete" />
          </span>
        </div>
        <div class="home_tabs">
          <van-tabs
            background="#181827"
            title-active-color="#ff2152"
            :border="false"
            @click="tabHandle"
            v-model="istabActive"
          >
            <van-tab title="recommend">
              <div slot="title" class="tabwraps">
                <div class="tabimgs">
                  <!-- <svg-icon class="icon_dongman2" icon-class="icon_dongman2" /> -->
                  <img
                    :class="{'active':istabActive==0}"
                    src="../assets/images/icon_tuijian1.png"
                    alt
                  />
                </div>
                <div class="tab_font">推荐</div>
              </div>
            </van-tab>
            <van-tab title="features">
              <div slot="title" class="tabwraps">
                <div class="tabimgs">
                  <img
                    :class="{'active':istabActive==1}"
                    src="../assets/images/icon_zhuanti1.png"
                    alt
                  />
                </div>
                <div class="tab_font">专题</div>
              </div>
            </van-tab>
            <van-tab title="avstarts">
              <div slot="title" class="tabwraps">
                <div class="tabimgs">
                  <img
                    :class="{'active':istabActive==2}"
                    src="../assets/images/icon_nvyou1.png"
                    alt
                  />
                </div>
                <div class="tab_font">女优</div>
              </div>
            </van-tab>
            <van-tab title="ranking">
              <div slot="title" class="tabwraps">
                <div class="tabimgs">
                  <img
                    :class="{'active':istabActive==3}"
                    src="../assets/images/icon_paihangbang1.png"
                    alt
                  />
                </div>
                <div class="tab_font">排行榜</div>
              </div>
            </van-tab>
            <van-tab v-for="(item,index) in homeTags" :title="item.tag_code" :key="index">
              <div slot="title" class="tabwraps">
                <div class="tabimgs">
                  <img :class="{'active':istabActive==index+4}" :src="item.tag_img" alt />
                </div>
                <div class="tab_font">{{item.tag_title}}</div>
              </div>
            </van-tab>
          </van-tabs>
        </div>
      </template>
      <!-- 默认插槽 就是内容区域 -->
      <template v-slot:default @load="loadMore()">
        <!-- 轮播只有推荐页展示 -->
        <div class="swipWrap" v-if="isrecommendTab">
          <Swipers :BannerList="BannerList" />
        </div>
        <!-- 切换tab展示对应内容 -->
        <!-- 不同的tabs不一样的布局 ,推荐，专题，女优,排行榜固定存在,所以对应不同的展示页面,其余后台返回的，统一一个展示页-->
        <div class="tabContentWrap">
          <div class="classTab1" v-if="isAVTab">
            <TabContentAV :AdListProp="AdList" />
          </div>
          <div class="classTab2" v-else-if="isFeaturesTab">
            <TabContentFeatures :AdListProp="AdList" />
          </div>
          <div class="classTab3" v-else-if="isrecommendTab">
            <TabRecommend :AdListProp="AdList" :getMoreTab.sync="currentTab" />
          </div>
          <div class="classTab5" v-else-if="isRank">
            <RankList></RankList>
          </div>
          <div class="classTab4">
            <div class="tab1">
              <p class="likeClass">
                <span class="span"></span>
                {{titleLine}}
              </p>
              <Advert :adItem="AdList[0]"></Advert>
              <TabContent :childProps="tabList"></TabContent>
            </div>
          </div>
        </div>
      </template>
    </BaseLayer>

    <!-- 左边抽屉内容 -->
    <drawer
      title="我是一个抽屉组件"
      :display.sync="display1"
      :inner="true"
      :showHeader="false"
      :width="drawerWidth"
      background="#181827"
      :mask="false"
    >
      <div class="searchContent">
        <div>
          <div class="title likeClass">
            <span class="span"></span> 我的频道
          </div>
          <div class="tags">
            <div
              class="tag"
              v-for="(item,index) in homeTags"
              :key="index"
              @click="getTabContent(item)"
            >{{item.tag_title}}</div>
          </div>
        </div>
        <div>
          <div class="title likeClass">
            <span class="span"></span>频道推荐
          </div>
          <div class="tags">
            <div
              class="tag"
              v-for="(item,index) in recomTags"
              :key="index+'a'"
              @click="getTabContent(item)"
            >{{item.tag_title}}</div>
          </div>
        </div>
      </div>
    </drawer>
  </div>
</template>

<script>
import TabRecommend from "@/components/TabRecommend.vue";
import TabContentAV from "@/components/TabContentAV.vue";
import RankList from "@/views/RankList.vue";
import TabContentFeatures from "@/components/TabContentFeatures.vue";
import TabContent from "@/components/TabContent.vue";
import Drawer from "@/components/Drawer/index";
import Swipers from "@/components/Swipers/index";
import Advert from "@/components/advert.vue";
import BaseLayer from "@/components/BaseLayer.vue";
import {
  getWebTagsApi,
  getTagVideosApi,
  getAdListApi,
  getBannerListApi,
  getRecomTagsApi,
  getLeftTagsApi
} from "@/apis/index";
import { setSessionStorage, getSessionStorage } from "@/utils/tools.js";
import { Toast } from "vant";
import { mapMutations, mapState } from "vuex";
export default {
  name: "Home",
  data() {
    return {
      currentPage: 1,
      istabActive: 0,
      isLoading: false,
      tagCode: "recommend",
      titleLine: "热门推荐",
      searchValue: "",
      showSearch: false,
      channelBoolen: false,
      display1: false,
      showLoading: true,
      drawerWidth: "100%",
      homeTags: [],
      tabList: [],
      BannerList: [],
      AdList: [],
      isAVTab: false,
      isFeaturesTab: false,
      isRank: false,
      isrecommendTab: true,
      moreLoading: true,
      d_moreLoading: true,
      currentTab: { j: false, i: null },
      recomTags: []
    };
  },
  components: {
    Drawer,
    Swipers,
    Advert,
    TabRecommend,
    TabContentAV,
    TabContentFeatures,
    TabContent,
    RankList,
    BaseLayer
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name == "rankList") {
        vm.$router.go(0);
      } else {
        next();
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    this.d_moreLoading = false;
    next();
  },
  deactivated() {},
  activated() {
    this.d_moreLoading = true;
  },
  created() {
    this.getTagsHandle();
    this.getBannerListHandle();
    this.getAdListHandle();
    // this.getRecomTagsHandle();
    this.getLeftTagsHandle();
  },
  computed: {
    ...mapState({
      historyTags: state => state.historyTags
    })
  },
  watch: {
    currentTab: function(val, oldVal) {
      this.currentPage = 0;
      this.istabActive = val.i + 4;
      this.tagCode = this.homeTags[val.i].tag_code;
      this.getTabVideoHandle();
      this.isAVTab = false;
      this.isFeaturesTab = false;
      this.isrecommendTab = false;
      this.titleLine = this.homeTags[val.i].tag_title;
    }
  },
  methods: {
    ...mapMutations({
      save_historyTags: "save_historyTags"
    }),
    gotoHomeHandle() {
      this.$router.go(0);
    },
    // 点击tag获取对应的内容
    getTabContent(item) {
      this.historyTags.push(item.tag_title);
      this.save_historyTags(this.historyTags);
      this.$router.push({
        name: "searchList",
        params: { searchTitle: item, fromTag: true }
      });
    },
    // 获取首页tabs标签
    getTagsHandle() {
      this.$http.post(getWebTagsApi, {}, false).then(result => {
        if (result) {
          if (result.Status == 200 && result.Data) {
            this.homeTags = result.Data.list;
          }
        }
      });
    },
    // 获取抽屉推荐频道
    // getRecomTagsHandle() {
    //   this.$http.post(getRecomTagsApi, {}, false).then(result => {
    //     this.AdList = result.Data.list;
    //   });
    // },
    getLeftTagsHandle() {
      this.$http.post(getLeftTagsApi, {}, false).then(result => {
        if (result) {
          if (result.Status == 200 && result.Data) {
            this.recomTags = result.Data.list;
          }
        }
      });
    },
    // 获取轮播
    getBannerListHandle() {
      this.$http.post(getBannerListApi, {}, false).then(result => {
        if (result) {
          if (result.Status == 200 && result.Data) {
            this.BannerList = result.Data.list;
          }
        }
      });
    },
    // 获取广告
    getAdListHandle() {
      this.$http.post(getAdListApi, {}, false).then(result => {
        setSessionStorage("AdList", result.Data.list);
        if (result) {
          if (result.Status == 200 && result.Data) {
            this.AdList = result.Data.list;
          }
        }
      });
    },
    loadMore() {
      // setTimeout(() => {
      this.getTabVideoHandle();
      // }, 1000);
    },
    //根据tag的code获取对应影片
    getTabVideoHandle() {
      this.currentPage++;
      console.log(this.currentPage);
      this.$http
        .post(
          getTagVideosApi,
          { page: this.currentPage, page_size: "3", code: this.tagCode },
          false
        )
        .then(result => {
          if (result) {
            if (result.Status == 200 && result.Data) {
              if (result.Data.list.length > 0) {
                console.log(111)
                this.tabList = this.tabList.concat(result.Data.list);
              }else{
               console.log(222)
               this.showLoading = false;
              }
            }
          } else {
            this.showLoading = false;
          }
        });
    },
    // 切换tab获取对应内容
    tabHandle(name, title) {
      this.tagCode = title;
      this.currentPage = 0;
      this.tabList = [];
      this.isAVTab = false;
      this.isFeaturesTab = false;
      this.isrecommendTab = false;
      this.isRank = false;
      if (title == "recommend") {
        //热门推荐页面特殊处理
        this.isrecommendTab = true;
        this.titleLine = "热门推荐";
      } else if (title == "features") {
        //专题页面特殊处理
        this.isFeaturesTab = true;
      } else if (title == "ranking") {
        //排行榜直接跳转到排行榜页面
        this.isRank = true;
      } else if (title == "avstarts") {
        // 女优页面特殊处理
        this.isAVTab = true;
      } else {
        this.titleLine = this.homeTags[name - 4].tag_title;
        this.getTabVideoHandle();
      }
    },
    changeSerach() {
      this.showSearch = !this.showSearch;
      this.searchValue = "";
    },
    openChannel() {
      this.channelBoolen = !this.channelBoolen;
      this.display1 = !this.display1;
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    },
    jumpToSearch() {
      this.$router.push({ name: "searchResult" });
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
}
.home_top {
  height: 80px;
  padding-top: 32px;
  display: flex;
  z-index: 100;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  .top_left {
    margin-right: 40px;
    width: 64px;
    height: 49px;
  }
  .top_mid {
    width: 467px;
    height: 64px;
    margin-right: 30px;
    line-height: 64px;
    .logo {
      display: inline-block;
      width: 149px;
      height: 81px;
      img {
        display: block;
        width: 100%;
      }
    }
  }
  .top_right {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center; /* 水平居中 */
    align-items: center; /* 垂直居中 */
  }
}
.swipWrap {
  margin: 10px 0px 30px 0px;
}
.home_tabs {
  margin-top: 16px;
  // border-top: 1px solid rgba($color: #656676, $alpha: 0.15);
  .tab_font {
    font-size: 0.5rem;
    margin-top: 17px;
  }

  .tabimgs {
    width: 90px;
    height: 90px;
    margin: 0 auto;
    img {
      display: inline-block;
      width: 100%;
      opacity: 0.7;
      &.active {
        opacity: 1;
      }
    }
  }
}
.searchContent {
  .title {
    margin-top: 60px;
    font-size: 0.6rem;
    text-align: left;
    padding-left: 40px;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    padding-left: 40px;
    .tag {
      font-size: 0.4rem;
      color: #fff;
      width: 180px;
      height: 50px;
      margin-top: 30px;
      background: rgba(255, 255, 255, 0.1);
      line-height: 50px;
      margin-right: 30px;
      border-radius: 40px;
    }
  }
}
.tab1 {
  .change {
    font-size: 30px !important;
    color: #c1c1c3;
    margin-bottom: 40px;
    margin-top: 20px;
    .tran {
      transform: rotate(360deg);
      transition: all 0.8s;
    }
    .Change_batch {
      margin-left: 24px;
      width: 30px;
      height: 30px;
    }
  }
}
.getMoreClass {
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  p {
    font-size: 30px;
  }

  .van-loading__spinner {
    margin-left: 24px;
  }
}
.logo {
  display: block;
  width: 222px;
  height: 64px;
}
.refreshClass {
  font-size: 0.3rem;
  padding-left: 200px;
  color: #ccc;
}
</style>
