import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    historyTags: []
  },
  getters: {
    getterhistoryTags: state => {
      return state.historyTags.filter(function (item, index, arr) {
        //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
        return arr.indexOf(item, 0) === index && item != "";
      });
    }
  },
  mutations: {
    save_historyTags(state, userId = []) {
      state.historyTags = [...new Set(userId)];
    },
    del_historyTags(state){
      state.historyTags=[]
    }
  },
  actions: {},
  modules: {}
});
