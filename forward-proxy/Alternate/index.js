const express = require("express");
const http = require("http");
const fs = require("fs");
const res = require("express/lib/response");

var app = express();
var PORT = 8080 || process.env.PORT;
var blacklist = [];
var iplist = [];

fs.watchFile("./blacklist", (curr, prev) => {
	updateBlacklist();
});

fs.watchFile("./iplist", (curr, prev) => {
	updateIplist();
});

app.set("trust proxy", true);

function updateBlacklist() {
	console.log("Updating blacklist");
	blacklist = fs
		.readFileSync("./blacklist", "utf-8")
		.split("\n")
		.filter((ele) => {
			return ele.length;
		})
		.map((regex) => {
			return RegExp(regex);
		});
}

function updateIplist() {
	console.log("Updating iplist");
	iplist = fs
		.readFileSync("./iplist", "utf-8")
		.split("\n")
		.filter((ele) => {
			return ele.length;
		});
}

function ipAllowed(ip) {
	for (i in iplist) {
		if (iplist[i] == ip) {
			return true;
		}
	}
	return false;
}

function hostAllowed(url) {
	for (i in blacklist) {
		if (blacklist[i].test(url)) {
			return false;
		}
	}
	return true;
}

function deny(res, msg) {
	res.writeHead(401);
	res.write(msg);
	res.end();
}

app.get("/", (req, res) => {
	var ip = req.ip;
	if (ip.substring(0, 7) == "::ffff:") {
		ip = ip.substring(7);
	}
	var url = req.url;
	if (!ipAllowed(ip)) {
		msg = "IP " + ip + " is not allowed to use this proxy";
		deny(res, msg);
		console.log(msg);
		return;
	}
	if (!hostAllowed(url)) {
		msg = "Host " + url + " has been denied by proxy configuration";
		deny(res, msg);
		console.log(msg);
		return;
	}
	var options = {
		method: req.method,
		url: req.url,
		headers: req.headers,
		port: 80,
		host: req.headers["host"],
	};
	console.log(options);
	console.log(req.socket.remoteAddress + " " + req.method + " " + req.url);
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

updateBlacklist();
updateIplist();
