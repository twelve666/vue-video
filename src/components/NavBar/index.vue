<template>
  <van-nav-bar
    :class="mainClass"
    :style="mainStyle"
    :title="title"
    :border="false"
    left-arrow
    @click-left="onClickLeft"
  ></van-nav-bar>
</template>
 <script>
import { Toast } from "vant";
export default {
  props: {
    title: {
      type: String,
      default: ""
    },
    // 是否使用绝对定位
    inner: {
      type: Boolean,
      default: false
    },
    isBack: {
      type: Boolean,
      default: false
    }
  },
  name: "navBar",
  watch: {},
  computed: {
    mainClass: function() {
      return {
        "main-position": this.inner
      };
    },
    mainStyle: function() {
      return {
        width: this.width,
        background: this.background,
        position: this.inner ? "absolute" : "relative"
      };
    }
  },
  mounted() {
    if (this.inner) {
      let box = this.$el.parentNode;
      box.style.position = "relative";
    }
  },
  methods: {
    onClickLeft() {
      if (this.isBack) {
        this.$router.back(-1);
      } else {
        this.$router.push({ name: "Home" });
      }
    }
  },
  destroyed() {}
};
</script>
<style lang="scss" scoped>
.main-position {
  top: 20px;
  z-index: 66;
  .van-icon {
    color: #fff;
  }
}
.van-nav-bar__left {
  left: 50px;
}
.van-nav-bar__arrow {
  font-size: 0.7rem;
}
</style>
