<template>
  <div class="avAddols" v-cloak style="[v-cloak]:display:none;">
    <div class="navWrap">
      <div class="navBack">
        <van-icon name="arrow-left" color="#B7B7B9" size="1rem" @click="goBack" />
      </div>
      <div class="navTitle">女优列表</div>
    </div>
    <!-- <div class="avAddolsTabs">
      <span :class="isSpan==0?'selectSpan':''" @click="isSpanHandle(0)">热门演员</span>
      <span :class="isSpan==1?'selectSpan':''" @click="isSpanHandle(1)">人气最高</span>
      <span :class="isSpan==2?'selectSpan':''" @click="isSpanHandle(2)">片量最多</span>
    </div>-->
    <!-- 类似通讯类的女优列表 -->
    <div class="atozClass" v-cloak style="[v-cloak]:display:none;">
      <aTozList
        :data="AVactorsList"
        @choose="onChoose"
        :useLazyLoad="true"
        v-if="AVactorsList.length"
      ></aTozList>
    </div>
  </div>
</template>

<script>
import aTozList from "@/components/SortsFromAtoZ";
import { getActorsApi, getActorVideoApi } from "@/apis/index";
export default {
  name: "City",
  data() {
    return {
      isSpan: 0,
      detailActor: {},
      AVactorsList: []
    };
  },
  components: {
    aTozList
  },
  created() {
    this.getActorsApiHandle();
  },
  methods: {
    // 获取女优演员列表
    getActorsApiHandle() {
      this.$http.post(getActorsApi, {}, false).then(result => {
        if (result) {
          if (result.Status == 200 && result.Data) {
            this.AVactorsList = result.Data.list;
          }
        }
      });
    },
    onChoose(item) {
      this.getHotActorhandle(item.id);
    },
    // 查询女优详情信息
    getHotActorhandle(p) {
      this.$http.post(getActorVideoApi, { id: p }, false).then(result => {
        if (result) {
          if (result.Status == 200 && result.Data) {
            this.detailActor = result.Data.list[0];
          }
        }
        this.$router.push({
          name: "detail",
          params: { avInfo: this.detailActor }
        });
      });
    },
    isSpanHandle(n) {
      this.isSpan = n;
    },
    goBack() {
      this.$router.back(-1);
    }
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
.avAddols {
  padding: 60px 22px 0px 35px;
  width: 100%;
  .navWrap {
    display: flex;
    align-items: center;
    padding-bottom: 40px;
    border-bottom: 1px solid rgba($color: #fff, $alpha: 0.15);
    .navBack {
      text-align: left;
    }
    .navTitle {
      flex-grow: 1;
      font-size: 36px;
      color: #b7b7b9;
    }
  }
  .avAddolsTabs {
    margin-top: 30px;
    display: flex;
    span {
      display: block;
      flex: 1;
      text-align: center;
      font-size: 34px;
      color: #c1c1c3;
    }
    .selectSpan {
      color: #ff2152;
    }
  }
}
.atozClass {
  position: fixed;
  top: 200px;
  bottom: 0;
  width: 100%;
}
</style>
