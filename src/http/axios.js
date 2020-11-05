import axios from "axios";
import { Toast } from "vant";
import qs from "qs";

let baseUrl = ""; // 请求的url
switch (process.env.NODE_ENV) {
  case "development":
    baseUrl = process.env.VUE_APP_BASEURL; // 测试环境url
    break;
  case "pre":
    baseUrl = process.env.VUE_APP_BASEURL; // 预上线环境url
    break;
  case "production":
    baseUrl = process.env.BASE_URL; // 生产环境url
    break;
}
axios.defaults.timeout = 5000;
axios.defaults.baseURL = baseUrl;
// 请求拦截
axios.interceptors.request.use(
  config => {
    // 1. 这个位置就请求前最后的配置
    // 2. 当然你也可以在这个位置 加入你的后端需要的用户授权信息
    if (config.data) {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截
axios.interceptors.response.use(
  response => {
    if (response && response.status == 200) {
      return response.data;
    } else {
      Toast.fail(response.statusText);
    }
    return;
  },
  error => {
    // 请求失败
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          // 对400错误您的处理\
          break;
        case 401:
          // 对 401 错误进行处理
          break;
        default:
          // 如果以上都不是的处理
          return Promise.reject(error);
      }
    }
  }
);
