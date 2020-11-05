<template>
  <!-- 广告位置 -->
  <div class="adPosition">
    <img v-if="adItem" :src="adItem.h5_img" @click="jump" />
  </div>
</template>

<script>
export default {
  name: "advert",
  props: {
    adItem: Object
  },
  data() {
    return {};
  },
  created() {
    // console.log(this.adItem);
  },
  methods: {
    jump(){
      window.open(this.adItem.jump_url,'_blank')
    }
  }
};
</script>

<style lang='scss' scoped>
.adPosition {
  margin-top: -10px;
}
</style>
