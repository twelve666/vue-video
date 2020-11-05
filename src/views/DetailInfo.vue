<template>
  <div class="wrapDetail">
    <div class="navBar">
      <div class="bgImgClass" :style="{backgroundImage: 'url(' + bgImg + ')' }"></div>
      <div class="maskClass">
        <div class="backClass">
          <van-icon name="arrow-left" color="#fff" size="1rem" @click="goBack" />
        </div>
        <div class="avInfoClass">
          <div class="avInfoLeftClass">
            <img :src="bgImg" />
          </div>
          <div class="avInfoRightClass">
            <p class="name">{{avInfo.name}}</p>
            <p>身高：{{avInfo.height}}</p>
            <p>三围：{{avInfo.bust}} {{avInfo.waist}} {{avInfo.hips}}</p>
            <p>罩杯：{{avInfo.cup}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 演员介绍 -->
    <div class="introClass">
      <p class="introTitleClass">演员介绍</p>
      <p class="introContentClass">{{avInfo.description?avInfo.description:'暂无介绍'}}</p>
    </div>
    <!-- 相关影片内容 -->
    <div class="likeMovies">
      <div class="likeMoviesTitle">
        <div class="divLeft">相关影片</div>
        <div class="divRight">
          <span
            :class="isActive==0?'isActiveClass':''"
            @click="isActiveHandle(0,'create_time')"
          >最新影片</span>
          <span :class="isActive==1?'isActiveClass':''" @click="isActiveHandle(1,'show_num')">最多播放</span>
        </div>
      </div>
      <div class="likeMoviesList">
        <div v-for="(v,i) in avInfo.video_list" :key="i" class="listItem">
          <div
            class="itemImgs"
            @click="goToplay(v)"
            :style="{backgroundImage: 'url(' + v.h5_img + ')' }"
          >
            <!-- <img :src="v.h5_img" :key="i" /> -->
          </div>
          <p class="itemTitle">{{v.description}}</p>
          <p class="itemTime">
            <span>上传时间:{{v.create_time}}</span>
            <span>播放量:{{v.show_num}}</span>
            <span class="gotoPlay" @click="goToplay(v)">去看片</span>
          </p>
        </div>
      </div>
      <!-- <div v-else>暂无相关影片</div> -->
    </div>
  </div>
</template>
 <script>
import { Toast } from "vant";
import NavBar from "@/components/NavBar/index";
import { getActorVideoApi } from "@/apis/index";
import { setSessionStorage, getSessionStorage } from "@/utils/tools.js";
export default {
  name: "detail",
  props: {},
  components: {
    NavBar
  },
  data() {
    return {
      bgImg: "",
      isActive: 0,
      avInfo: {},
      avId: null
    };
  },
  created() {
    if (this.$route.params && this.$route.params.avInfo) {
      setSessionStorage("detailInfo", this.$route.params.avInfo);
      this.bgImg = this.$route.params.avInfo.avatar;
      this.avId = this.$route.params.avInfo.id;
      this.getHotActorhandle(this.avId);
    } else {
      this.bgImg = getSessionStorage("detailInfo").avatar;
      this.avId = getSessionStorage("detailInfo").id;
      this.getHotActorhandle(this.avId);
    }
  },
  mounted() {
    // this.bgImg = this.$route.params.avInfo.h5_img;
  },
  methods: {
    goToplay(item) {
      this.$router.push({ name: "play", params: { videoUrl: item } });
    },
    goBack() {
      this.$router.back(-1);
    },
    // 查询女优详情信息
    getHotActorhandle(p) {
      this.$http.post(getActorVideoApi, { id: p }, false).then(result => {
        if (result) {
          if (result.Status == 200 && result.Data) {
            this.avInfo = result.Data.list[0];
          }
        }
      });
    },
    //  order_by 排序字段;默认更新时间create_time,播放时长video_time,播放次数show_num
    isActiveHandle(val, p) {
      this.isActive = val;
      this.$http
        .post(
          getActorVideoApi,
          { id: this.avInfo.id, order_by: p, order_asc: "desc" },
          false
        )
        .then(result => {
          if (result) {
            if (result.Status == 200 && result.Data) {
              this.avInfo = result.Data.list[0];
            }
          }
        });
    }
  }
};
</script>
<style scoped lang="scss">
.wrapDetail {
  overflow: hidden;
  .navBar {
    width: 100%;
    height: 445px;
    position: relative;
    .bgImgClass {
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      position: absolute;
      opacity: 0.25;
    }
    .maskClass {
      width: 100%;
      height: 100%;
      .backClass {
        padding-top: 100px;
        padding-left: 50px;
        text-align: left;
      }
      .avInfoClass {
        display: flex;
        padding-left: 50px;
        margin-top: 46px;
        .avInfoLeftClass {
          width: 167px;
          height: 167px;
          border-radius: 100%;
          border: 5px solid #ff2152;

          img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 100%;
          }
        }
        .avInfoRightClass {
          margin-left: 50px;
          color: #fff;
          text-align: left;
          .name {
            font-size: 36px;
            color: #ffffff;
          }
          p:nth-child(2) {
            margin-top: 10px;
          }
          p:nth-child(n + 2) {
            margin-top: 6px;
          }
        }
      }
    }
  }
  .introClass {
    width: 650px;
    margin: 0 auto;
    margin-top: 30px;
    text-align: left;
    .introTitleClass {
      font-size: 36px;
      color: #b7b7b9;
    }
    .introContentClass {
      font-size: 30px;
      color: #c1c1c3;
    }
  }
  .likeMovies {
    text-align: left;
    width: 650px;
    margin: 0 auto;
    margin-top: 58px;
    .likeMoviesTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
      .divLeft {
        font-size: 36px;
        color: #b7b7b9;
      }
      .divRight {
        font-size: 30px;
        color: #b7b7b9;
        span:nth-child(1) {
          margin-right: 40px;
        }
        .isActiveClass {
          color: #ff2152;
        }
      }
    }
    .likeMoviesList {
      .listItem {
        margin-bottom: 30px;
        .itemImgs {
          width: 620px;
          height: 360px;
          display: flex;
          flex-wrap: wrap;
          background-repeat: no-repeat;
          background-position: 50% 50%;
          background-size: contain;
          // justify-content: space-between;
          justify-content: center;
          img {
            display: block;
            // width: 680px;
            // height: 378px;
            // border-radius: 20px;
            // margin-top: 10px;
          }
        }
        .itemTitle {
          margin-top: 30px;
          font-size: 30px;
          color: #c1c1c3;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box; //作为弹性伸缩盒子模型显示。
          -webkit-box-orient: vertical; //设置伸缩盒子的子元素排列方式--从上到下垂直排列
          -webkit-line-clamp: 2; //显示的行
        }
        .itemTime {
          margin-top: 37px;
          font-size: 24px;
          color: #c1c1c3;
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            display: block;
          }
          .gotoPlay {
            width: 136px;
            height: 57px;
            text-align: center;
            line-height: 57px;
            background: #ff2152;
            font-size: 30px;
            color: #ffffff;
            border-radius: 28px;
            border-radius: 28px;
          }
        }
      }
    }
  }
}
</style>
