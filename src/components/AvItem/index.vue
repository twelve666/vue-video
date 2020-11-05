<template>
  <div class="avItem">
    <div class="videoClass">
      <div class="boxTop" @click.stop="goToDetail(item)">
        <div class="boxImg" >
          <img :src="item.avatar?item.avatar:item.h5_img" alt />
        </div>
        <div class="boxtitle">
          <div class="name">{{item.name}}</div>
          <div class="info">{{item.description?item.description:'暂无介绍'}}</div>
        </div>
        <div class="tags">{{item.video_count}}部影片</div>
      </div>
      <div class="box-bottom-out-wp">
        <div :class="`box-bottom-wp wrapper-${item.id}`" ref="wrapper">
          <div class="boxBottom" :style="{width: cWidth}">
            <div class="boxBottomDiv" v-for="(v,i) in videoList" :key="i" @click.stop="goToplay(v)">
              <div class="img">
                <img :src="v.h5_img" alt />
              </div>
              <p class="title">{{v.title}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getActorVideoApi } from "@/apis/index";
import BScroll from 'better-scroll';
export default {
  name: "TabContent",
  props: {
    item: Object,
    loadMore: Boolean,
    pageSize: {
      type: Number,
      default: 4
    }
  },
  components: {},
  data() {
    return {
      videoList: [],
      scroll: null,
      curPage: 1,
      totalPage: 1
    };
  },
  computed: {
    cWidth() {
      return ((90 + 10) * this.videoList.length) + 10 + 'px';
    }
  },
  watch:{
    item: {
      immediate: true,
      deep: true,
      handler: function() {
        this.videoList = this.item.video_list;
        this.totalPage = Math.ceil(this.item.video_count / this.pageSize)
      }
    }
  },
  methods: {
    goToDetail(item) {
      this.$router.push({ name: "detail", params: { avInfo: item } });
    },
     goToplay(item) {
      this.$router.push({ name: "play", params: { videoUrl: item } });
    },
    loadMoreData() {
      if (this.curPage > this.totalPage) return;
      this.curPage++;
      this.$http.post(getActorVideoApi, {
          id: this.item.id,
          page: this.curPage,
          page_size: this.pageSize
        }, false).then(result => {
          if (result &&result.Status === 200) {
            let data = result.Data.list;
            if (data && data.length > 0) {
              this.videoList.push(...data[0].video_list);
              this.scroll.refresh();
            }
          }
      });
    },
    initScroll() {
      this.curPage = 1;
      this.scroll = new BScroll(this.$refs.wrapper, {
        scrollX: true,
        click: true,
        tap: true,
        eventPassthrough: 'vertical'
      });
      this.scroll.on('scrollEnd', (e) => {
        this.loadMoreData()
      });
    }
  },
  mounted() {
    this.initScroll();
  }
};
</script>

<style scoped lang="scss">
.videoClass {
  position: relative;
  margin-top: 30px;
  .boxTop {
    position: relative;
    display: flex;
    padding-left: 50px;
    .boxImg {
      width: 130px;
      height: 130px;
      border-radius: 100%;
      background: #d8d8d8;
      border: 5px solid #ff2152;
      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 100%;
        border:1px solid transparent;
      }
    }
    .boxtitle {
      margin-left: 30px;
      .name {
        text-align: left;
        font-size: 36px;
        color: #b7b7b9;
      }
      .info {
        width: 480px;
        // height: 90px;
        text-align: left;
        margin-top: 6px;
        word-wrap: break-word; /* 内容存在英语或数字时强制换行 */
        overflow: hidden; /* 隐藏溢出部分 */
        text-overflow: ellipsis; /* 显示省略符号来代表被隐藏的文本 */
        display: -webkit-box; /* 将对象作为弹性伸缩盒子模型显示 */
        -webkit-box-orient: vertical; /* 设置盒子内排列顺序为纵向 */
        -webkit-line-clamp: 2;
      }
    }
    .tags {
      width: 138px;
      height: 48px;
      line-height: 48px;
      position: absolute;
      right: 0px;
      top: 0px;
      font-size: 24px;
      color: #ffffff;
      background: #ff2152;
      border-bottom-left-radius: 0.5rem;
    }
  }
  .box-bottom-out-wp {
    padding: 0 10px;
  }
  .box-bottom-wp {
    overflow: hidden;
  }
  .boxBottom {
    min-width: 320px;
    height: 296px;
    margin-top: 30px;
    overflow: hidden;
    .boxBottomDiv {
      width: 180px;
      float: left;
      margin-right: 10px;
      .img {
        width: 100%;
        height: 244px;
        display: flex;
        align-items: center;
        img {
          width: 100%;
          height: 150px;
          border-radius: 6px;
        }
      }
      .title {
        margin-top: 20px;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
      }
    }
  }
}
</style>
