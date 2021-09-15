const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  if (process.env.REACT_APP_API_PROXY) {
    app.use(
      process.env.REACT_APP_API_ENDPOINT,
      createProxyMiddleware({
        target: process.env.REACT_APP_API_PROXY,
        changeOrigin: true,
        pathRewrite: {
          [process.env.REACT_APP_API_ENDPOINT]: "",
        },
      })
    );
  }
};
