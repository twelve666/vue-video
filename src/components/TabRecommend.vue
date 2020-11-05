<template>
  <div class="RecommendWrap" v-infinite-scroll="loadMore" infinite-scroll-distance="100">
    <div class="recomendPart">
      <p class="likeClass">
        <span class="span"></span>
        每日精彩影片
      </p>
      <div class="videoClass" v-for="(item,index) in dayRecommendList" :key="index">
        <div
          class="imgbox"
          :style="{backgroundImage: 'url(' + item.h5_img + ')' }"
          @click.stop="goToplay(item)"
        >
          <svg-icon class="playbtn" style="width:2.15rem;height:2.15rem" icon-class="icon_ Play" />
        </div>
        <div class="vtitle">
          <span class="dTitle">{{item.title}}</span>
          <span class="plues">
            <span>
              <van-icon size="18" color="#B7B7B9" name="eye-o" />
            </span>
            <span>{{item.show_num}}</span>
          </span>
        </div>
      </div>
      <p class="change">
        <span @click="dayRecommendring()">换一批</span>
        <svg-icon class="Change_batch" icon-class="icon_Change batch" :class="{tran:isTran}" />
      </p>
      <Advert :adItem="AdListProp[0]"></Advert>
    </div>
    <!-- <div v-for="(item,index) in tabsVideos" :key="index" class="recomendPart recomendPart_2">
      <p class="likeClass">
        <span class="span"></span>
        <span>{{tagsType[index].tag_title}}</span>
        <span class="more" @click="getMore(index)">查看更多>></span>
      </p>
      <div class="videoClass" v-for="(v,i) in item.Data.list" :key="i">
        <div
          class="imgbox"
          :style="{backgroundImage: 'url(' + v.h5_img + ')' }"
          @click.stop="goToplay(v)"
        >
          <svg-icon class="playbtn" style="width:2.15rem;height:2.15rem" icon-class="icon_ Play" />
        </div>
        <div class="vtitle">
          <span class="dTitle">{{v.title}}</span>
          <span class="plues">
            <span>
              <van-icon size="18" color="#B7B7B9" name="eye-o" />
            </span>
            <span>{{v.show_num}}</span>
          </span>
        </div>
      </div>
      <p class="change">
        <span @click="ring(tagsType[index].tag_code)">换一批</span>
        <svg-icon class="Change_batch" icon-class="icon_Change batch" :class="{tran:isTran}" />
      </p>
      <Advert :adItem="AdListProp[index]"></Advert>
    </div>-->
    <div class="recomendPart">
      <p class="likeClass">
        <span class="span"></span>
        猜你喜欢
      </p>
      <div class="videoClass" v-for="(item,index) in recommendList" :key="index">
        <div
          class="imgbox"
          :style="{backgroundImage: 'url(' + item.h5_img + ')' }"
          @click.stop="goToplay(item)"
        >
          <svg-icon class="playbtn" style="width:2.15rem;height:2.15rem" icon-class="icon_ Play" />
        </div>
        <div class="vtitle">
          <span class="dTitle">{{item.title}}</span>
          <span class="plues">
            <span>
              <van-icon size="18" color="#B7B7B9" name="eye-o" />
            </span>
            <span>{{item.show_num}}</span>
          </span>
        </div>
      </div>
    </div>

    <div class="getMoreClass" v-if="showLoading">
      <p>加载中</p>
      <van-loading type="spinner" size="18px" v-show="showLoading" />
    </div>
    <!-- <div class="getMoreClass" @click="getNextPage" v-else-if="hasMoreRecommend">
      <p>加载更多</p>
    </div>-->
    <div class="getMoreClass" v-else>
      <p>暂无更多</p>
    </div>
    <Advert :adItem="AdListProp[1]"></Advert>
  </div>
</template>

<script>
import Advert from "@/components/advert.vue";
import TabContent from "@/components/TabContent.vue";
import {
  getRecommendVideoApi,
  getTagVideosApi,
  getWebTagsApi,
  getHotVideosApi,
  getRecomTagsApi
} from "@/apis/index";
export default {
  name: "TabRecommend",
  props: {
    AdListProp: Array,
    getMoreTab: Object
  },
  components: {
    Advert,
    TabContent
  },
  data() {
    return {
      isTran: false,
      showLoading: false,
      currentPage: 1,
      recommendNum: 0,
      dayRecommendNum: 0,
      recommendList: [],
      dayRecommendList: [],
      tabsVideos: [],
      tagsType: [],
      isFirstLoadRecommend: true,
      recommendTotalCount: 0,
      tempRecommendTotalCount: 0,
      recommendTotalPage: 1,
      RECOMMEND_PAGE_SIZE: 5
    };
  },
  computed: {
    hasMoreRecommend() {
      return (
        this.recommendNum <
        Math.ceil(this.recommendTotalCount / this.RECOMMEND_PAGE_SIZE)
      );
    }
  },
  created() {
    this.getHotVideosHandle();
    // this.initVideosHandle();
    this.getRecommendVideoHandle();
  },
  methods: {
    // 获取广告
    getAdListHandle() {
      this.$http.post(getAdListApi, {}, false).then(result => {
        if (result) {
          if (result.Status == 200 && result.Data) {
            this.AdList = result.Data.list;
          }
        }
      });
    },
    // 初始化获取视频
    // initVideosHandle() {
    //   const d = [];
    //   this.$http.post(getWebTagsApi, { page_size: "3" }, false).then(result => {
    //     this.tagsType = result.Data.list;
    //     if (result.Data.list.length > 0) {
    //       for (let index = 0; index < result.Data.list.length; index++) {
    //         const c = result.Data.list[index].tag_code;
    //         d.push(
    //           this.$http.post(
    //             getTagVideosApi,
    //             { code: c, page: 1, page_size: "3" },
    //             false
    //           )
    //         );
    //       }
    //     }
    //     Promise.all(d).then(res => {
    //       this.tabsVideos = res;
    //     });
    //   });
    // },
    //获取热门视频，当做每日精彩视频
    getHotVideosHandle() {
      this.dayRecommendNum++,
        this.$http
          .post(
            getHotVideosApi,
            { page: this.dayRecommendNum, page_size: "3" },
            false
          )
          .then(result => {
            if (result) {
              if (result.Status == 200 && result.Data) {
                this.dayRecommendList = result.Data.list;
                this.isTran = false;
              }
            }
          });
    },
    // 获取推荐影片,当做猜你喜欢的视频
    getRecommendVideoHandle() {
      this.recommendNum++, (this.showLoading = true);
      this.$http
        .post(
          getRecommendVideoApi,
          { page: this.recommendNum, page_size: this.RECOMMEND_PAGE_SIZE },
          false
        )
        .then(result => {
          if (result && result.Status == 200 && result.Data) {
            this.showLoading = false;
            this.recommendTotalCount = result.Data.count;
            if (this.isFirstLoadRecommend) {
              this.tempRecommendTotalCount = this.recommendTotalCount;
            }
            this.recommendTotalPage = Math.ceil(
              this.recommendTotalCount / this.RECOMMEND_PAGE_SIZE
            );
            this.showLoading = false;
            // 检查是否已经存在
            (result.Data.list || []).forEach(item => {
              let foundItem = this.recommendList.find(
                rItem => rItem.id === item.id
              );
              if (!foundItem) {
                this.recommendList.push(item);
              }
            });
            // 有新数据
            if (
              !this.isFirstLoadRecommend &&
              this.recommendTotalCount !== this.tempRecommendTotalCount
            ) {
              this.tempRecommendTotalCount = this.recommendTotalCount;
              this.recommendNum = this.recommendTotalPage - 1;
            }
            this.isFirstLoadRecommend = false;
          }
        });
    },
    // 通过标签获取影片
    getTagVideosHandle(c) {
      this.currentPage++,
        this.$http
          .post(
            getTagVideosApi,
            { code: c, page: this.currentPage, page_size: "3" },
            false
          )
          .then(result => {
            if (result) {
              if (result.Status == 200) {
                let matchedIndex = this.tagsType
                  .map(function(obj) {
                    return obj.tag_code;
                  })
                  .indexOf(c);
                this.$set(this.tabsVideos, matchedIndex, result);
                this.isTran = false;
              }
            }
          });
    },
    //换一批
    // ring(v) {
    //   this.isTran = true;
    //   this.getTagVideosHandle(v);
    // },
    //每日精彩推荐的换一批
    dayRecommendring() {
      this.isTran = true;
      this.getHotVideosHandle();
    },
    goToplay(item) {
      this.$router.push({ name: "play", params: { videoUrl: item } });
    },
    getMore(v) {
      this.$emit("update:getMoreTab", { j: !this.getMoreTab.j, i: v });
    },
    // 点击加载更多回调
    loadMore() {
      this.showLoading = true;
      //官方示例中延迟了1秒，防止滚动条滚动时的频繁请求数据
      setTimeout(() => {
        this.getRecommendVideoHandle();
      }, 1000);
    }
  }
};
</script>

<style scoped lang="scss">
.box {
  // overflow: hidden;
  width: 100%;
  height: 200px;
}
.videoClass {
  position: relative;
  height: 460px;
  .videoMask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
  }
}
.imgbox {
  width: 680px;
  height: 378px;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: contain;
}
.vtitle {
  width: 680px;
  height: 42px;
  margin: 0 auto;
  margin-top: 24px;
  display: flex;
  justify-content: space-between; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  .dTitle {
    width: 400px;
    height: 100%;
    display: inline-block;
    color: #c1c1c3;
    font-size: 30px;
    text-align: left;
    overflow: hidden; //超出的文本隐藏
    text-overflow: ellipsis; //溢出用省略号显示
    white-space: nowrap; //溢出不换行
  }
  .plues {
    width: 200px;
    height: 100%;
    line-height: 42px;
    text-align: right;
    display: inline-block;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #b7b7b9;
    span {
      display: inline-block;
      height: 100%;
      line-height: 42px;
    }
    span:nth-child(1) {
      margin-right: 10px;
    }
    span:nth-child(2) {
      min-width: 30px;
    }
  }
}
.playbtn {
  position: absolute;
  z-index: 5;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
}
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
</style>
