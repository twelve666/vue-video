<template>
  <!-- 创建一个通用布局 每个页面引用 只需要 在插槽填入内容即可 目的是使better-scroll创建的布局被通用 -->
  <div class="baselayer-main">
    <div class="header">
      <slot name="header"></slot>
    </div>
    <!-- 希望这里形成一个better-scroll的容器 -->
    <div class="content" ref="wrapper">
      <div class="content-body">
        <slot></slot>
         <div class="getMoreClass" v-if="showLoad">
      <p>加载更多</p>
      <van-loading type="spinner" size="18px" v-show="showLoad" />
    </div>
    <div class="getMoreClass" v-else>
      <p>暂无更多</p>
    </div>
      </div>
    </div>
   
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "baselayer-main",
  props: {
    showLoad: Boolean
  },
  data() {
    return {};
  },
  mounted() {
    this.$nextTick(() => {
      this.initScroller();
    });
  },
  methods: {
    initScroller() {
      //初始化betterScroll
      let self = this;
      self.scroller = new BScroll(self.$refs.wrapper, {
        probeType: 1,
        click: true,
        pullUpLoad: {
          threshold: 20 //当上拉距离超过盒子高度的5px的时候,就派发一个上拉加载的事件
        },
        scrollbar: {
          fade: false,
          interactive: false 
        },
        bounce: {
          top: true,
          bottom: false,
          left: true,
          right: true
        }
      });
      self.scroller.on("pullingUp", function() {
        //上拉加载事件
        self.$parent.getTabVideoHandle();
        self.scroller.finishPullUp(); //可以多次执行上拉加载，没有这段代码上拉只会加载一次
      });
      self.scroller.refresh();
    }
  }
};
</script>

<style lang='scss' scoped>
.baselayer-main {
  height: 100%;
  position: relative;
  .header {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 99;
    background-color: #181827;
  }
  .content {
    width: 100%;
    height: 100%;
    margin-top: 310px;
    // margin-bottom: -100px;
  }
}
</style>
