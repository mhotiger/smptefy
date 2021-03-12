  
const {createProxyMiddleware} = require('http-proxy-middleware')

module.exports = function(app) {
    console.log("setting up proxy-------------------------------------------------------------------")
    app.use(createProxyMiddleware('/auth', { target: 'http://localhost:5000' }));
    app.use(createProxyMiddleware('/api', { target: 'https://api.spotify.com'}))
};