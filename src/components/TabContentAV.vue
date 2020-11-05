<template>
  <div class="tab_contnet" v-infinite-scroll="loadMore" infinite-scroll-distance="100">
    <p class="likeClass likeClass1 likeClass2">
      <span class="span"></span>
      人气女优
      <span class="gotoMore" @click="gotoMore">查看更多>></span>
    </p>
    <div class="videoClass" v-for="(item,index) in HotActor" :key="index">
      <AvItem :item="item" />
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
import VideoPlay from "@/components/Video/index";
import AvItem from "@/components/AvItem";
import { getHotActorsApi } from "@/apis/index";
export default {
  name: "TabContent",
  props: {
    childProps: Array
  },
  components: {
    AvItem
  },
  data() {
    return {
      HotActor: [],
      showLoading: false,
      hotNum: 0,
      hotSize: 3
    };
  },
  created() {
    this.getHotActorhandle();
  },
  methods: {
    getHotActorhandle() {
      this.hotNum++;
      this.$http
        .post(
          getHotActorsApi,
          { page: this.hotNum, page_size: this.hotSize },
          false
        )
        .then(result => {
          if (result) {
            if (result.Status == 200 && result.Data) {
              this.HotActor.push.apply(this.HotActor, result.Data.list);
              this.showLoading = false;
            }
          } else {
            this.showLoading = false;
          }
        });
    },
    // 点击加载更多回调
    loadMore() {
      this.showLoading = true;
      //官方示例中延迟了1秒，防止滚动条滚动时的频繁请求数据
      setTimeout(() => {
        this.getHotActorhandle();
      }, 1000);
    },
    gotoMore() {
      this.$router.push({ name: "avAdols" });
    }
  }
};
</script>

<style scoped lang="scss">
.videoClass {
  position: relative;
  margin-top: 30px;
}
.likeClass {
  position: relative;
  .gotoMore {
    position: absolute;
    top: 0px;
    right: 40px;
    font-size: 24px;
    color: #c1c1c3;
  }
}
</style>
