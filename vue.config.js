const path = require("path");

const resolve = dir => {
  return path.join(__dirname, dir);
};
const publicPath = process.env.NODE_ENV === "production" ? "/" : "/";

module.exports = {
  lintOnSave: false,
  publicPath: publicPath,
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("postcss-pxtorem")({
            // 把px单位换算成rem单位
            rootValue: 64, // 换算的基数(设计图750的根字体为32)
            selectorBlackList: ["weui", "mu"], // 忽略转换正则匹配项
            propList: ["*"]
          })
        ]
      }
    }
  },
  devServer: {
    proxy: {
      "/api": {
        target: "http://test.cao6969.com",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
    // proxy: "http://test.cao6969.com"
  },
  chainWebpack: config => {
    config.module
      .rule("svg")
      .exclude.add(resolve("src/assets/icons")) // icons存放地（svg放的地方）
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/assets/icons")) // icons存放地（svg放的地方）
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();
    config.resolve.alias
      .set("@", resolve("src")) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set("_A", resolve("src/apis"));
  }
};
