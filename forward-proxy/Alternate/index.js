const express = require("express");
const http = require("http");
var app = express();
var PORT = 8080 || process.env.PORT;

app.get("/", (req, res) => {
	var options = {
		method: req.method,
		url: req.url,
		headers: req.headers,
		port: 80,
		host: req.headers["host"],
	};
	console.log("Connected to the proxy server");
	var proxyReq = http.request(options, (proxyRes) => {
		proxyRes.addListener("data", (chunk) => {
			res.write(chunk, "binary");
		});
		proxyRes.addListener("end", () => {
			res.end();
		});
		res.writeHead(proxyRes.statusCode, proxyRes.headers);
	});
	req.addListener("data", (chunk) => {
		proxyReq.write(chunk, "binary");
	});
	req.addListener("end", () => {
		proxyReq.end();
	});
});

app.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});
