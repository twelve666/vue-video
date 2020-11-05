<template>
  <div class="tab_contnet">
    <div class="videoClass" v-for="(item,index) in childProps" :key="index">
      <div
        class="imgbox"
        :style="{backgroundImage: 'url(' + item.h5_img + ')' }"
        @click.stop="goToplay(item)"
      >
        <!-- <img :src="item.h5_img" alt /> -->
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
</template>

<script>
export default {
  name: "TabContent",
  props: {
    childProps: Array,
    isSelf: Boolean
  },
  components: {},
  data() {
    return {};
  },
  methods: {
    goToplay(item) {
      if (this.isSelf) {
        this.$emit("update:likeToChild", item);
      } else {
        this.$router.push({ name: "play", params: { videoUrl: item } });
      }
    }
  }
};
</script>

<style scoped lang="scss">
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
</style>
