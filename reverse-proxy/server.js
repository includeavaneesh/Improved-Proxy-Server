const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const options = {
    target: 'http://www.example.org',
    changeOrigin : true,
    ws : true,
    pathRewrite: {
        '^/api/old-path': '/api/new-path', // rewrite path
        '^/api/remove/path': '/path', // remove base path
    },

    router: {
        // when request.headers.host == 'dev.localhost:3000',
        // override target 'http://www.example.org' to 'http://localhost:8000'
        'dev.localhost:3000': 'http://localhost:8000',
    },
}
const exampleProxy = createProxyMiddleware(options);

const app = express();
app.use('/api', exampleProxy);

// app.use('/api', createProxyMiddleware({ target: 'http://www.example.org', changeOrigin: true }));

var server = app.listen(3000, function(){
    var host = server.address().address
    var port = server.address().port
   
    console.log("Example app listening at http://%s:%s", host, port)
});

// http://localhost:3000/api/foo/bar -> http://www.example.org/api/foo/bar