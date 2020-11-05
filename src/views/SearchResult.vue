<template>
  <div class="searchWrap">
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
    <div class="searchHistory" v-cloak style="[v-cloak]:display:none;" v-if="showBloon">
      <div class="wrap">
        <div class="title likeClass">
          <span class="span"></span>
          历史搜索
        </div>
        <img src="../assets/delete.png" alt @click="del_historyTags" v-show="historyTags.length>0" />
      </div>
      <div class="tags" v-cloak style="[v-cloak]:display:none;">
        <div v-if="getterhistoryTags.length<1">暂无搜索记录</div>
        <div
          v-else
          class="tag"
          v-for="(item,index) in getterhistoryTags"
          :key="index"
          @click="onSearchHistory(item)"
        >{{item}}</div>
      </div>
    </div>
    <div class="searchContent" v-cloak style="[v-cloak]:display:none;" v-if="showBloon">
      <div class="title likeClass">
        <span class="span"></span>
        热门搜索
      </div>
      <div class="tags">
        <div
          class="tag"
          v-for="(item,index) in searchTop"
          :key="index"
          @click="onSearchTag(item)"
        >{{item.tag_title}}</div>
      </div>
      <div class="searchTab">
        <van-tabs v-model="active" background="#181827" :border="false" scrollspy sticky>
          <van-tab v-for="(item,index) in filterTags" :title="item.title" :key="index">
            <div class="searchTags">
              <p class="tabTags likeClass likeClass1">
                <span class="span"></span>
                {{item.title}}
              </p>
              <div class="tagSpan">
                <span
                  v-for="(v,i) in item.list_two"
                  :key="i"
                  @click="onSearchTag({tag_title: v.title, tag_code:v.code})"
                >{{v.title}}</span>
              </div>
            </div>
          </van-tab>
        </van-tabs>
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
export default {
  name: "searchResult",
  props: {},
  components: { VideoPlay, SearchItem },
  data() {
    return {
      active: 0,
      showBloon: true,
      searchValue: "",
      currentPage: 1,
      searchTop: [],
      videoList: [],
      filterTags: [],
      m_tagCode: ""
    };
  },
  created() {
    if (this.$route.params.videoUrl != undefined) {
      this.m_tagCode = this.$route.params.videoUrl.tag_code;
      this.onSearchTag(this.m_tagCode);
    } else {
      this.getSearchTopHandle();
    }
    this.getFilterTagsHandle();
  },
  computed: {
    ...mapState({
      historyTags: state => state.historyTags
    }),
    ...mapGetters(["getterhistoryTags"])
  },
  methods: {
    ...mapMutations({
      save_historyTags: "save_historyTags",
      del_historyTags: "del_historyTags"
    }),
    goToplay(item) {
      this.$router.push({ name: "play", params: { videoUrl: item } });
    },
    // 获取筛选标签
    getFilterTagsHandle() {
      this.$http.post(getFilterTagsApi, {}, false).then(result => {
        if (result) {
          if (result.Status == 200 && result.Data) {
            this.filterTags = result.Data.list_one;
          }
        }
      });
    },
    // 获取标签
    getSearchTopHandle() {
      this.$http
        .post(getWebTagsApi, { page_size: "60" }, false)
        .then(result => {
          if (result) {
            if (result.Status == 200 && result.Data) {
              this.searchTop = result.Data.list;
            }
          }
        });
    },
    // 返回上一级
    onClickLeft() {
      this.$router.back(-1);
    },
    // 通过输入框输入搜索数据
    onSearch(val) {
      this.historyTags.push(this.searchValue);
      this.save_historyTags(this.historyTags);
      this.$router.push({
        name: "searchList",
        params: { searchTitle: this.searchValue, fromTag: false }
      });
    },
    onSearch1(val) {
      this.videoList = [];
      this.currentPage = 1;
    },
    onSearchHistory(val) {
      this.searchValue = val;
      this.onSearch();
    },
    // 通过点击热门搜索搜索数据，也就是通过标签搜索
    onSearchTag(v, fromTag) {
      this.historyTags.push(v.tag_title);
      this.save_historyTags(this.historyTags);
      this.$router.push({
        name: "searchList",
        params: { searchTitle: v, fromTag: true }
      });
    },
    onCancel() {
      Toast("取消");
    },
    //加载更多
    goNextPage() {
      this.currentPage++;
      if (this.searchValue) {
        this.onSearch();
      } else {
        this.onSearchTag(this.m_tagCode);
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
      line-height: 50px;
      margin-right: 30px;
      border-radius: 40px;
      border: 2px solid #ff2152;
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
