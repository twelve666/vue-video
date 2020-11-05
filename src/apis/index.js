// 默认都是post请求
const getWebTagsApi = "/app/web_tags.do"; // 获取一级菜单
const getTagVideosApi = "/app/tag_videos.do"; // 通过菜单获取下面的视频列表
const getLikeRecommendApi = "/app/like_recommend.do"; // 获取播放视频的相关推荐视频
const getAdListApi = "/app/ad_list.do"; // 广告图
const getBannerListApi = "/app/banner_list.do"; // banner图
const getSearchTopApi = "/app/search_top.do"; // 获取搜索-一级标签
const getSearchTwoApi = "/app/search_two.do"; // 获取搜索-二级标签
const getSearchResultApi = "/app/title_videos.do"; // 搜索查询
const getFilterTagsApi = "/app/filter_tags.do"; // 查询筛选-标签（搜索页用于复选）
const getHotFeaturesApi = "/app/hot_tags.do"; // 专题，热门专题
const getHotActorsApi = "/app/hot_actors.do"; // 查询人气女优
const getActorVideoApi = "/app/actor_video.do"; // 女优详情公用接口
const getRecommendVideoApi = "/app/recommend_video.do"; // 获取推荐影片，当做首页猜你喜欢
const getHotVideosApi = "/app/hot_videos.do"; // 热门视频，当做首页每日精彩影片
const getActorsApi = "/app/actors.do"; //女优列表的接口 获取所有演员
const getRankingDayApi = "/app/ranking_day.do"; //日排行榜
const getRankingWeekApi = "/app/ranking_week.do"; //周排行榜
const getRankingMonthApi = "/app/ranking_month.do"; //月排行榜
const getVideoPlusApi = "/app/video_plus.do"; //统计每个影片的播放次数，默认进入播放页就+1
const getRecomTagsApi = "/app/recom_tags.do"; //每日精彩影片
const getLeftTagsApi ='/app/left_tags.do'//首页-抽屉-推荐频道


export {
  getWebTagsApi,
  getTagVideosApi,
  getLikeRecommendApi,
  getAdListApi,
  getBannerListApi,
  getActorsApi,
  getRecommendVideoApi,
  getSearchTopApi,
  getSearchTwoApi,
  getSearchResultApi,
  getFilterTagsApi,
  getHotFeaturesApi,
  getHotActorsApi,
  getHotVideosApi,
  getRankingDayApi,
  getRankingWeekApi,
  getRankingMonthApi,
  getVideoPlusApi,
  getActorVideoApi,
  getRecomTagsApi,
  getLeftTagsApi
};
