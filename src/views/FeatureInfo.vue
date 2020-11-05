<template>
  <div class="featureWrap" v-infinite-scroll="loadMore" infinite-scroll-distance="100">
    <div class="backTitle">
      <van-nav-bar left-arrow :title="titleF" @click-left="onClickLeft" :border="false" />
    </div>
    <div class="imgbox">
      <img :src="tagImg" alt />
    </div>
    <TabContent :childProps="tabList"></TabContent>
    <div>
      <div class="getMoreClass" v-if="showLoading">
        <p>加载更多</p>
        <van-loading type="spinner" size="18px" v-show="showLoading" />
      </div>
      <!-- <div class="getMoreClass" v-else-if="isPage">
        <p>暂无数据</p>
      </div>-->
      <div class="getMoreClass" v-else>
        <p>暂无更多</p>
      </div>
    </div>
  </div>
</template>

<script>
import TabContent from "@/components/TabContent.vue";
import VideoPlay from "@/components/Video/index";
import Swipers from "@/components/Swipers/index";
import { getHotFeaturesApi, getTagVideosApi } from "@/apis/index";
import { setSessionStorage, getSessionStorage } from "@/utils/tools.js";
export default {
  name: "FeautureInfo",
  props: {
    childProps: Array
  },
  components: {
    VideoPlay,
    Swipers,
    TabContent
  },
  data() {
    return {
      titleF: "",
      projectcode: "",
      showLoading: false,
      currentPage: 0,
      tagImg: "",
      tabList: [],
      isPage: true
    };
  },
  created() {
    if (this.$route.params.code != undefined) {
      this.projectcode = this.$route.params.code;
      this.tagImg = this.$route.params.tag_img;
      this.titleF = this.$route.params.title;
    } else {
      this.projectcode = getSessionStorage("projectcode");
      this.tagImg = getSessionStorage("projectImg");
      this.titleF = getSessionStorage("projectTitle");
    }
    this.getTagVideosHandel();
  },
  methods: {
    onClickLeft() {
      this.$router.back(-1);
    },
    loadMore() {
      this.showLoading = true;
      setTimeout(() => {
        console.log(this.currentPage);
        this.getTagVideosHandel();
      }, 1000);
    },
    getTagVideosHandel() {
      this.currentPage++;
      this.$http
        .post(
          getTagVideosApi,
          { code: this.projectcode, page: this.currentPage, page_size: "3" },
          false
        )
        .then(result => {
          if (result) {
            if (result.Status == 200 && result.Data) {
              this.tabList.push.apply(this.tabList, result.Data.list);
              this.showLoading = false;
            }
          }else{
            this.showLoading = false;
          }
        });
    }
    // 点击加载下一页,加载更多
    // getNextPage() {
    //   this.showLoading = true;
    //   this.getTagVideosHandel();
    // }
  }
};
</script>

<style scoped lang="scss">
.featureWrap {
  padding-bottom: 40px;
  .backTitle {
    margin-top: 25px;
    margin-bottom: 25px;
    ::v-deep .van-icon {
      color: #fff;
      font-size: 0.7rem;
    }
    ::v-deep .van-nav-bar__title {
      font-size: 36px;
    }
  }
  .imgbox {
    background: #181827;
    img {
      display: block;
      width: 100%;
      height: 360px;
    }
    margin-bottom: 30px;
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
  .vtitle {
    width: 140px;
    height: 50px;
    line-height: 50px;
    text-align: center;
    top: 83px;
    left: 38px;
    font-size: 34px;
    color: #ffffff;
    position: absolute;
  }
}
</style>
