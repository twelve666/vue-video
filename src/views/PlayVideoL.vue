<template>
  <div class="wrapContent">
    <NavBar :inner="true" :isBack="true" />
    <div class="videoClassPlay">
      <VideoPlay :videoItem="sourceUrl.videoUrl" />
      <p class="intro intro1">上传时间：{{sourceUrl.videoUrl.create_time}}</p>
      <div class="intro intro2">
        <div class="vTitle">影片标签:</div>
        <div class="vtags">
          <span
            class="vplaytag"
            v-for="(item,index) in sourceUrl.videoUrl.tag_list"
            :key="index"
          >{{item}}</span>
        </div>
      </div>
    </div>
    <!-- 广告位置 -->
    <div class="adPosition">
      <Advert :adItem="AdList[0]"></Advert>
    </div>
    <!-- 加入是av女优的影片则展示，女优片集 -->
    <!-- <div v-if="isJapanAv"> -->
    <div v-if="false">
      <p class="likeClass likeClass1">
        <span class="span"></span>
        女优片集
      </p>
      <AvItem :item="isAvItem" />
    </div>
    <!-- 相似推荐 -->
    <div>
      <p class="likeClass likeClass1">
        <span class="span"></span>
        相似推荐
      </p>
      <TabContent :childProps="videoArry"></TabContent>
      <p v-if="!videoArry.length">没有更多视频啦</p>
    </div>
    <div v-if="videoArry.length" class="getMoreClass" @click="getNextPage">加载更多</div>
  </div>
</template>
<script>
import NavBar from "@/components/NavBar/index";
import VideoPlay from "@/components/Video/index";
import { getLikeRecommendApi, getVideoPlusApi } from "@/apis/index";
import { setSessionStorage, getSessionStorage } from "@/utils/tools.js";
import TabContent from "@/components/TabContent.vue";
import AvItem from "@/components/AvItem";
import Advert from "@/components/advert.vue";
export default {
  name: "play",
  props: {},
  components: {
    VideoPlay,
    NavBar,
    TabContent,
    AvItem,
    Advert
  },
  data() {
    return {
      currentPage: 1,
      sourceUrl: {},
      videoArry: [],
      isJapanAv: false,
      isAvItem: {},
      AdList: []
    };
  },
  created() {
    if (this.$route.params && this.$route.params.videoUrl) {
      setSessionStorage("routerParm", this.$route.params);
      this.sourceUrl = this.$route.params;
      this.AdList = getSessionStorage("AdList");
      this.getLikeRecommend(this.sourceUrl.videoUrl.id);
      this.addVideoPlus(this.sourceUrl.videoUrl.id);
      if (this.$route.params.videoUrl.nation.includes("日本")) {
        this.isJapanAv = true;
        this.isAvItem = this.$route.params.videoUrl;
      } else {
        this.isJapanAv = false;
      }
    } else {
      this.sourceUrl = getSessionStorage("routerParm");
      this.AdList = getSessionStorage("AdList");
      this.getLikeRecommend(this.sourceUrl.videoUrl.id);
      this.addVideoPlus(this.sourceUrl.videoUrl.id);
    }
  },
  mounted() {},
  methods: {
    //影片播放次数加1
    addVideoPlus(p) {
      this.$http.post(getVideoPlusApi, { id: p }, false).then(result => {
        // console.log('播放次数+1')
      });
    },
    //得到相似影片
    getLikeRecommend(valId) {
      this.$http
        .post(
          getLikeRecommendApi,
          { page: this.currentPage, page_size: "5", id: valId },
          false
        )
        .then(result => {
          if (result) {
            if (result.Status == 200 && result.Data) {
              this.videoArry.push.apply(this.videoArry, result.Data.list);
            }
          }
        });
    },
    // 点击加载下一页,加载更多
    getNextPage() {
      this.currentPage++;
      this.getLikeRecommend(this.sourceUrl.videoUrl.id);
    },
    goToplay(item) {
      this.$router.push({ name: "play", params: { videoUrl: item } });
    }
  }
};
</script>
<style lang="scss" scoped>
.videoClass {
  position: relative;
  height: 480px;
  .videoMask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
  }
}
.intro {
  padding-left: 30px;
  margin-top: 10px;
  text-align: left;
}
.likeClass {
  text-align: left;
  padding-left: 50px;
  height: 60px;
  line-height: 60px;
  font-size: 0.5rem;
  margin-top: 60px;
  color: #fff;
  position: relative;
}
.getMoreClass {
  padding: 40px;
}
.intro2 {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  .vTitle {
    width: 110px;
    margin-top: 10px;
  }
  .vtags {
    width: 600px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    .vplaytag {
      font-size: 24px;
      display: block;
      border: 2px solid #ff2152;
      padding: 4px 10px;
      line-height: 100%;
      border-radius: 25px;
      color: #fff;
      margin: 10px;
    }
  }
}
</style>
