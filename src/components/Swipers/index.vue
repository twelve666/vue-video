<template>
  <!-- 内容 -->
  <div class="swiper-container" id="swiper">
    <!-- 轮播图 -->
    <swiper v-if="BannerList.length > 0" :options="swiperOption" ref="mySwiper">
      <swiper-slide class="swiper-slide" v-for="item in BannerList" :key="item.id">
        <div>
          <a :href="item.jump_url" target="_blank" v-if="item.jump_url && item.jump_url.length > 0">
            <img :src="item.h5_img" />
          </a>
          <img :src="item.h5_img" v-else />
        </div>
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
export default {
  props: {
    BannerList: {
      type: Array
    }
  },
  name: "Swipers",
  data() {
    return {
      swiperOption: {
        loop: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        autoplay: {
          delay: 2500
        },
        observer: true, //修改swiper自己或子元素时，自动初始化swiper
        observeParents: true, //修改swiper的父元素时，自动初始化swiper
        slidesPerView: "auto",
        spaceBetween: 10,
        centeredSlides: true
      }
    };
  },
  components: {},
  created() {},
  methods: {
    swiper() {
      // return this.$refs.mySwiper.swiper;
    },
    // 点击轮播跳转到播放页
    jumpTovideo(val) {
      window.open(val.jump_url, "_blank");
    }
  }
};
</script>
<style lang="scss" scoped>
/* pageFullScreen在index.css */
#swiper {
  width: 100%;
  overflow: hidden;
  padding: 0 0 10px 0;
}

.swiper-container,
.swiper-container2 {
  width: 750px;
  height: 360px;
  overflow: visible !important;
  position: relative;
}
#swiper .swiper-container .swiper-wrapper .swiper-slide {
  width: 650px;
  height: 360px;

  div {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      border-radius: 10px;
    }
  }
}

/* 上一张 */
#swiper .swiper-container .swiper-wrapper .swiper-slide-prev div {
  margin-top: 40px;
  height: 280px !important;
}
/* 下一张 */
#swiper .swiper-container .swiper-wrapper .swiper-slide-next div {
  margin-top: 40px;
  height: 280px !important;
}

/* 中间的图片 */
.swiper-container .swiper-wrapper .swiper-slide-active {
  height: 360px !important;
}

.swiper-pagination-color {
  color: #00ff33;
} /* 两种都可以 */
</style>
