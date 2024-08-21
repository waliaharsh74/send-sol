// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://staging.crossmint.com',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '', // Remove /api prefix when forwarding the request
            },
        })
    );
};
