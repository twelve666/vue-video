<template>
  <div id="app">
    <div v-cloak class="app1">
      <transition :name="transitionName" mode="out-in">
        <keep-alive :include="['Home']" :exclude="['TabRecommend']">
          <router-view />
        </keep-alive>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      transitionName: "slide-left" //默认动画
    };
  },
  components: {},
  created() {},
  mounted() {},
  methods: {},
  watch: {
    $route(to, from, next) {
      //页面切换动画
      const toIndex = to.meta.index;
      const fromIndex = from.meta.index;
      this.transitionName = toIndex > fromIndex ? "slide-right" : "slide-left";
    }
  }
};
</script>>
<style lang="scss">
html,body{
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #c1c1c1;
  font-size: 15px;
  overflow: hidden;
  background: #181827;
  height: 100%;
}
.app1{
  height: 100%;
}
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}

.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}

.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>
