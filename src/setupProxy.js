const proxy = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    proxy("/server1/**", {
      target: "https://company.cnshanzhi.com:8005/",
      changeOrigin: true,
      pathRewrite: {
        "^/server1": "https://company.cnshanzhi.com:8005/" //路径重写
      }
    })
  );
  app.use(
    proxy("/server2/**", {
      // target: "http://118.25.155.176",
      target: "https://company.cnshanzhi.com",
      changeOrigin: true,
      pathRewrite: {
        "^/server2": "https://company.cnshanzhi.com" //路径重写
      }
    })
  );
  app.use(
    proxy("/server3/**", {
      // target: "http://118.25.155.176",
      target: "https://company.cnshanzhi.com",
      changeOrigin: true,
      pathRewrite: {
        "^/server3": "http://jiekou.4980.cn/action.php" //路径重写
      }
    })
  );
  app.use(
    proxy("/server4", {
      target: "http://jiekou.4980.cn/upload.php",
      changeOrigin: true,
      pathRewrite: {
        "^/server4": "" //路径重写
      }
    })
  );
  // 请求4PX接口
  app.use(
    proxy("/order_imgApi", {
      target: "http://jiekou.4980.cn/imgApi.php",
      changeOrigin: true,
      pathRewrite: {
        "^/order_imgApi": ""
      }
    })
  );
  // 请求DHL接口
  app.use(
    proxy("/order_getToken", {
      target: "http://jiekou.4980.cn/dhlApi.php?type=getToken",
      changeOrigin: true,
      pathRewrite: {
        "^/order_getToken": ""
      }
    })
  );
  app.use(
    proxy("/order_getLabel", {
      target: "http://jiekou.4980.cn/dhlApi.php?type=getLabel",
      changeOrigin: true,
      pathRewrite: {
        "^/order_getLabel": ""
      }
    })
  );
  // 请求顺丰接口
  app.use(
    proxy("/order_sfLabelApi", {
      target: "http://jiekou.4980.cn/sfLabelApi.php",
      changeOrigin: true,
      pathRewrite: {
        "^/order_sfLabelApi": ""
      }
    })
  );
  // 请求纵横接口
  app.use(
    proxy("/order_getImg", {
      target: "http://jiekou.4980.cn/ZhApi.php?type=getImg",
      changeOrigin: true,
      pathRewrite: {
        "^/order_getImg": ""
      }
    })
  );
  
};
