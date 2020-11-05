<template>
  <div class="searchWrap" v-infinite-scroll="loadMore" infinite-scroll-distance="100">
    <div class="searchTop">
      <div class="searchL" @click="onClickLeft">
        <van-icon name="arrow-left" size="0.9rem" />
      </div>
      <div class="searchW">
        <van-search
          v-model="searchValue"
          shape="round"
          background="#181827"
          placeholder="请输入搜索关键词"
          @search="onSearch"
          @cancel="onCancel"
          @input="onSearch1(searchValue)"
        />
      </div>
      <div class="searchR" @click="onSearch" v-show="videoList.length<0">搜索</div>
    </div>
    <div>
      <div v-if="videoList.length<1">暂无搜索结果</div>
      <div v-else>
        <SearchItem :childProps="videoList"></SearchItem>
        <div>
          <div class="getMoreClass" v-if="showLoading">
            <p>加载更多</p>
            <van-loading type="spinner" size="18px" v-show="showLoading" />
          </div>
          <div class="getMoreClass" v-else>
            <p>暂无更多</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
 <script>
import { Toast } from "vant";
import SearchItem from "@/components/SearchItem.vue";
import { mapState, mapMutations, mapGetters } from "vuex";
import {
  getWebTagsApi,
  getTagVideosApi,
  getSearchResultApi,
  getFilterTagsApi
} from "@/apis/index";
import VideoPlay from "@/components/Video/index";
import { setSessionStorage, getSessionStorage } from "@/utils/tools.js";
export default {
  name: "searchList",
  props: {},
  components: { VideoPlay, SearchItem },
  data() {
    return {
      active: 0,
      searchValue: "",
      currentPage: 1,
      searchTop: [],
      videoList: [],
      filterTags: [],
      m_tagCode: "",
      showLoading: false
    };
  },
  created() {
    if (this.$route.params.searchTitle) {
      if (this.$route.params.fromTag) {
        setSessionStorage("searchKey", {
          id: this.$route.params.searchTitle.tag_code,
          isCode: true
        });
        this.m_tagCode = this.$route.params.searchTitle.tag_code;
        this.onSearchTag();
      } else {
        this.searchValue = this.$route.params.searchTitle;
        setSessionStorage("searchKey", {
          id: this.$route.params.searchTitle,
          isCode: false
        });
        this.onSearch();
      }
    } else {
      if (getSessionStorage("searchKey").isCode) {
        this.m_tagCode = getSessionStorage("searchKey").id;
        this.onSearchTag();
      } else {
        this.searchValue = getSessionStorage("searchKey").id;
        this.onSearch();
      }
    }
  },
  computed: {},
  methods: {
    goToplay(item) {
      this.$router.push({ name: "play", params: { videoUrl: item } });
    },
    loadMore() {
      this.showLoading = true;
      //官方示例中延迟了1秒，防止滚动条滚动时的频繁请求数据
      setTimeout(() => {
        console.log("load more");
        this.goNextPage();
      }, 1000);
    },
    // 返回上一级
    onClickLeft() {
      this.$router.back(-1);
    },
    // 通过输入框输入搜索数据
    onSearch(val) {
      this.$http
        .post(
          getSearchResultApi,
          {
            title: this.searchValue,
            page: this.currentPage,
            page_size: "5"
          },
          false
        )
        .then(result => {
          if (result) {
            if (result.Data.list.length < 1) {
              Toast("暂无更多视频");
              this.showLoading = false;
            }
            if (result.Status == 200 && result.Data) {
              this.videoList.push.apply(this.videoList, result.Data.list);
              this.showLoading = false;
            }
          } else {
            this.showLoading = false;
          }
        });
    },
    // 通过点击热门搜索搜索数据，也就是通过标签搜索
    onSearchTag(val) {
      this.$http
        .post(
          getTagVideosApi,
          { code: this.m_tagCode, page: this.currentPage, page_size: "5" },
          false
        )
        .then(result => {
          if (result) {
            if (result.Data.list.length < 1) {
              Toast("暂无更多视频");
              this.showLoading = false;
            }
            if (result.Status == 200 && result.Data) {
              this.videoList.push.apply(this.videoList, result.Data.list);
              this.showLoading = false;
            }
          } else {
            this.showLoading = false;
          }
        });
    },
    onSearch1(val) {
      this.videoList = [];
      this.currentPage = 1;
      this.$route.params.fromTag = false;
      setSessionStorage("searchKey", {
        id: val,
        isCode: false
      });
    },
    onCancel() {
      Toast("取消");
    },
    //加载更多
    goNextPage() {
      this.currentPage++;
      if (getSessionStorage("searchKey").isCode) {
        this.onSearchTag();
      } else {
        this.onSearch();
      }
    }
  },
  watch: {}
};
</script>
<style lang="scss" scoped>
.searchWrap {
  padding-bottom: 60px;
}
.searchTop {
  display: flex;
  margin: 0 auto;
  padding: 20px 38px;
  align-items: center; /*垂直居中 */
  .searchL {
    margin-right: 30px;
  }
  .searchW {
    width: 467px;
    margin-right: 31px;
  }
  .searchR {
    font-size: 0.5rem;
  }
}
.wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    margin-top: 60px;
    width: 32px;
    height: 32px;
    margin-right: 37px;
  }
}
.searchContent,
.searchHistory {
  .title {
    margin-top: 60px;
    font-size: 0.5rem;
    text-align: left;
    padding-left: 45px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    padding-left: 40px;
    .tag {
      font-size: 0.4rem;
      color: #fff;
      width: 180px;
      height: 50px;
      margin-top: 30px;
      border: 2px solid #ff2152;
      line-height: 50px;
      margin-right: 30px;
      border-radius: 40px;
    }
  }
}
.searchTab {
  margin-top: 66px;
}
.searchTags {
  text-align: left;
  margin-top: 30px;
  .tabTags {
    font-size: 34px;
    color: #ffffff;
    margin-bottom: 30px;
  }
  .tagSpan {
    display: flex;
    flex-wrap: wrap;
    padding-left: 45px;
    span {
      display: block;
      // width: 126px;
      padding: 0 40px;
      height: 60px;
      font-size: 0.4rem;
      color: #ffffff;
      text-align: center;
      line-height: 60px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 30px;
      margin-bottom: 30px;
      margin-right: 30px;
    }
  }
}
</style>
