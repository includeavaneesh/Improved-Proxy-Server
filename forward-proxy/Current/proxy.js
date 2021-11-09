const net = require("net");
const fs = require("fs");
const server = net.createServer();

var blacklist = [];

fs.watchFile("./blacklist", (curr, prev) => {
	updateBlacklist();
});

function updateBlacklist() {
	console.log("Updating Blacklist");
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

function hostAllowed(url) {
	for (i in blacklist) {
		if (blacklist[i].test(url)) {
			return false;
		}
	}
	return true;
}

server.on("connection", (clientToProxySocket) => {
	console.log("Client connected to the Proxy");
	clientToProxySocket.once("data", (data) => {
		var isTLSConnection = data.toString().indexOf("CONNECT") !== -1;
		var serverPort = isTLSConnection ? 443 : 80;
		var serverAddress = isTLSConnection
			? data.toString().split("CONNECT ")[1].split(" ")[0].split(":")[0]
			: data.toString().split("Host: ")[1].split("\r\n")[0];
		console.log("--x--");
		console.log("Address: " + serverAddress);
		if (!hostAllowed(serverAddress)) {
			message =
				"Host " + serverAddress + " has been denied by proxy configuration";
			console.log(message);
			return;
		}
		var proxyToServerSocket = net.createConnection(
			{
				host: serverAddress,
				port: serverPort,
			},
			() => {
				console.log("Proxy connected to the Server");
				if (isTLSConnection) {
					clientToProxySocket.write(
						"HTTP/1.1 200 Connection established\r\n\r\n"
					);
				} else {
					proxyToServerSocket.write(data);
				}
				clientToProxySocket.pipe(proxyToServerSocket);
				proxyToServerSocket.pipe(clientToProxySocket);

				proxyToServerSocket.on("error", (err) => {
					console.log("Proxy Error");
					console.log(err);
				});
			}
		);
		clientToProxySocket.on("error", (err) => {
			console.log("Client Error");
			console.log(err);
		});
	});
});

server.on("error", (err) => {
	console.log("Server Error");
	console.log(err);
});

server.on("close", () => {
	console.log("Client Disconnected");
});

server.listen(8124, () => {
	console.log("Server listening on 8124");
});

updateBlacklist();
