<template>
  <div class="index-list">
    <ul class="index-list-wrap" ref="indexWrap" @scroll="onListWrapScroll">
      <li v-for="(group,index) in data" :key="index" class="index-group" ref="indexGroup">
        <h3 class="index-group-title">{{group.title}}</h3>
        <ul class="flex-box">
          <li
            @click="clickItem(item)"
            v-for="(item,index) in group.items"
            :key="index"
            class="index-group-item"
          >
             <img v-if="useLazyLoad" v-lazy="item.avatar" class="avatar" alt />
            <img   v-else :src="item.avatar" class="avatar" alt />
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="index-nav">
      <ul>
        <li
          v-for="(item,index) in indexList"
          :key="index"
          @touchstart.prevent="_onTouchStartIndex(index)"
          :data-index="index"
          class="nav-item"
          :class="{'active':currentIndex===index}"
        >{{index==0?'#':item}}</li>
      </ul>
    </div>
    <transition name="fade">
      <div class="index-indicator" v-show="moving">{{currentIndicator}}</div>
    </transition>
  </div>
</template>
<script type="text/javascript">
const INDICATOR_INDURATION = 1000;
const TITLE_HEIGHT = 30;
export default {
  name: "aTozList",
  props: {
    data: {
      type: Array,
      default: function() {
        return [];
      }
    },
    useLazyLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentIndex: 0,
      moving: false,
      currentIndicator: ""
    };
  },
  watch: {
    currentIndex(newVal) {
      clearTimeout(this.timer);
      this.currentIndicator = this.indexList[this.currentIndex];
      if (this.currentIndicator == "片") {
        this.moving = false;
        console.log(this.currentIndicator);
      } else {
        this.moving = true;
        this.timer = setTimeout(() => {
          this.moving = false;
        }, INDICATOR_INDURATION);
      }
    }
  },
  computed: {
    indexList() {
      return this.data.map(item => {
        return item.title.substring(0, 1);
      });
    }
  },
  created() {
    this.listHeight = [];
    this.timer = null;
    this.scrollTimer = null;
  },
  mounted() {
    setTimeout(() => {
      this._calculateHeight();
    }, 20);
  },
  methods: {
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.indexGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    _onTouchStartIndex(index) {
      this.currentIndex = index;
      this.$refs.indexWrap.scrollTop = this.listHeight[index];
    },
    clickItem(item) {
      this.$emit("choose", item);
    },
    onListWrapScroll(e) {
      clearTimeout(this.scrollTimer);
      this.scrollTimer = setTimeout(() => {
        let scrollTop = this.$refs.indexWrap.scrollTop;
        const listHeight = this.listHeight;
        for (let i = 0; i < listHeight.length - 1; i++) {
          if (
            scrollTop <= listHeight[i + 1] - TITLE_HEIGHT &&
            scrollTop >= listHeight[i]
          ) {
            this.currentIndex = i;
            return;
          }
        }
      }, 20);
    }
  },
  destroyed() {
    clearTimeout(this.timer);
    clearTimeout(this.scrollTimer);
  }
};
</script>

<style lang="scss" scoped>
.index-list {
  position: relative;
  width: 100%;
  height: 100%;
  .index-list-wrap {
    height: 100%;
    overflow: auto;
    -webkit-overflow-scrolling: touch; //#issue-368550974
    .index-group {
      padding-bottom: 30px;
    }
    .index-group:nth-child(1) {
      position: relative;
      .index-group-title::after {
        content: "";
        width: 6px;
        height: 30px;
        position: absolute;
        left: 32px;
        background: #ff2152;
      }
    }
  }

  .index-group-title {
    height: 30px;
    text-align: left;
    line-height: 30px;
    padding-left: 50px;
    font-size: 30px;
    color: rgba(255, 255, 255, 0.5);
  }
  .flex-box {
    display: flex;
    flex-wrap: wrap;
    width: 90%;
    .index-group-item {
      width: 100px;
      // display: flex;
      // align-items: center;
      padding: 20px 0 0 30px;
      list-style: none;
      .avatar {
        display: block;
        width: 100px;
        height: 100px;
        border-radius: 50%;
      }
      .name {
        display: inline-block;
        width: 100%;
        // margin-left: 20px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 20px;
      }
    }
  }

  .index-nav {
    position: absolute;
    right: 60px;
    top: 30%;
    z-index: 100;
    width: 20px;
    padding: 20px 0;
    text-align: center;
    border-radius: 10;
    transform: translateY(-30%);
    .nav-item {
      padding: 3px;
      font-size: 30px;
      color: rgba(255, 255, 255, 0.5);
      list-style: none;
      &.active {
        color: #ff2152;
      }
    }
    .nav-item:nth-child(1) {
      display: none;
    }
  }
  .index-indicator {
    position: absolute;
    width: 50px;
    height: 50px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    line-height: 50px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    font-size: 22px;
    border-radius: 5px;
    pointer-events: none;
  }
}
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
