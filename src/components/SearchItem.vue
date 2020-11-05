<template>
  <div class="tab_contnet">
    <div class="videoClass" v-for="(item,index) in childProps" :key="index">
      <div class="wrap">
        <div class="imgbox" @click.stop="goToplay(item)">
          <img :src="item.h5_img" alt />
          <div class="wrap1">
            <div class="vtitle">{{item.title}}</div>
            <div class="describe">
              <span v-for="(item,index) in item.tag_list" :key="index">{{item}}</span>
            </div>
          </div>
        </div>
        <div class="time">
          <span>上传时间:{{item.create_time | b }}</span>
          <span class="times">{{item.show_num}}次播放</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPlay from "@/components/Video/index";
export default {
  name: "TabContent",
  props: {
    childProps: Array
  },
  components: {
    VideoPlay
  },
  data() {
    return {
      times: "26万次播放次数"
    };
  },
  created() {},
  mounted() {
    var date = new Date();
  },
  methods: {
    goToplay(item) {
      if (this.$route.name == "play") {
        this.$router.push({ name: "playL", params: { videoUrl: item } });
        return false;
      }
      this.$router.push({ name: "play", params: { videoUrl: item } });
    }
  },
  filters: {
    // a: function(value) {
    //   if (!value) return "";
    //   return value.substring(0, 2);
    // },
    b: function(value) {
      if (!value) return "";
      value = new Date(value);
      var y = value.getFullYear();
      var m = value.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = value.getDate();
      d = d < 10 ? "0" + d : d;
      return y + "-" + m + "-" + d;
    }
  }
};
</script>

<style scoped lang="scss">
.videoClass {
  position: relative;
  // height: 400px;
  margin-top: 30px;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  .videoMask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
  }
  .wrap {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    width: 650px;
    height: 280px;
    .imgbox {
      display: flex;
      justify-content: space-around;
      align-items: flex-start;
      margin: 0 auto;
      border-radius: 2%;
      overflow: hidden;
      padding-top: 14px;
      padding-bottom: 7px;
      img {
        display: block;
        width: 291px;
        height: 214px;
        border-radius: 10px;
      }
    }
    .wrap1 {
      width: 300px;
      .vtitle {
        color: #c1c1c3;
        font-size: 30px;
        text-align: left;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
      }
      .describe {
        margin-top: 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        span {
          font-size: 12px;
          display: block;
          margin-top: 10px;
          margin-right: 4px;
          border: 2px solid #ff2152;
          border-radius: 30px;
          padding: 6px;
        }
      }
    }
    .time {
      padding: 0 23px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 0 auto;
      width: 650px;
      box-sizing: border-box;
      span {
        display: block;
      }
      .times {
        font-size: 24px;
        color: #ff2152;
      }
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
</style>
