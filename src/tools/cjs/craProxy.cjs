const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app, apiEndpoint, apiProxy) {
  if (apiProxy) {
    app.use(
      apiEndpoint,
      createProxyMiddleware({
        changeOrigin: true,
        pathRewrite: {
          [apiEndpoint]: "",
        },
        target: apiProxy,
      }),
    );
  }
};
