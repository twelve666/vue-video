<template>
  <div class="tabsSlide">
    <div
      class="itemContent"
      v-for="(item,index) in listArry"
      :class="active == index ? 'activeClass' : '' "
      :key="index"
      @click="changeActive(index)"
    >{{item.title}}</div>
    <!-- <div class="itemBackground" style="width: 41px; transform: translateX(289px) translateX(-50%); transition-duration: 0.3s;"></div> -->
    <!-- <div class="itemBackground" :style="mainStyle"></div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      width: 0,
      transformD: 0
    };
  },
  props: {
    // 数组
    listArry: {
      type: Array
    },
    // 点击选中的背景颜色
    background: {
      type: String,
      default: "red"
    }
  },
  created() {
    this.width = 1 / this.listArry.length;
  },
  computed: {
    mainStyle: function() {
      return {
        width: 100 * this.width + "%",
        position: "absolute",
        // left: this.transformD,
        left: 100 * this.transformD + "%",
        height: "20px",
        transitionDuration: "0.4s"
      };
    }
  },
  mounted() {
    let box = this.$el.parentNode;
    box.style.position = "relative";
  },
  methods: {
    changeActive(index) {
      this.active = index;
      this.transformD = this.width * index;
    }
  }
};
</script>

<style lang="scss" scoped>
.tabsSlide {
  width: 100%;
  display: flex;
  /* item*/
  .itemContent {
    color: green;
    flex: 1;
    text-align: center;
  }
  .activeClass {
    color: #fff;
    background: red;
    border-radius: 100%;
  }
  .itemBackground {
    background: red;
  }
}
</style>
