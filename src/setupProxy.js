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
  
};
