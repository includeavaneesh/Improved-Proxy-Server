const net = require("net");
const server = net.createServer();
const mongoose = require("mongoose");
const Address = require("./models/addSchema");

//Connecting to mongoose
(async () => {
	try {
		await mongoose.connect("mongodb://localhost:27017/ISAA");
		console.log("Connected to Database\n\n");
	} catch (error) {
		console.log(error);
	}
})();

server.on("connection", (clientToProxySocket) => {
	// console.log(clientToProxySocket); //socket
	console.log("--------------------------");
	console.log("Client connected to proxy");
	clientToProxySocket.once("data", async (data) => {
		var isTLSConnection = data.toString().indexOf("CONNECT") !== -1;
		var serverPort = 80;
		var serverAddress;
		//console.log("Data to String: " + data.toString()); //CONNECT www.google.com HTTP/1.1
		if (isTLSConnection) {
			serverPort = 443;
			serverAddress = data
				.toString()
				.split("CONNECT")[1]
				.split(" ")[1]
				.split(":")[0];
		} else {
			serverAddress = data.toString().split("Host: ")[1].split("\r\n")[0];
		}
		console.log("Server Address: " + serverAddress);

		// Creating a connection from proxy to destination server
		var proxyToServerSocket = net.createConnection(
			{
				host: serverAddress,
				port: serverPort,
			},
			() => {
				console.log("Proxy to server set up");
			}
		);

		if (isTLSConnection) {
			clientToProxySocket.write("HTTP/1.1 200 OK\r\n\r\n");
		} else {
			proxyToServerSocket.write(data);
		}

		clientToProxySocket.pipe(proxyToServerSocket);
		proxyToServerSocket.pipe(clientToProxySocket);

		proxyToServerSocket.on("error", (err) => {
			console.log("Proxy to server error");
			console.log(err);
		});

		clientToProxySocket.on("error", (err) => {
			console.log("Client to proxy error");
			console.log(err);
		});
	});
});

server.on("error", (err) => {
	console.log("Some internal server error occurred");
	console.log(err);
});

server.on("close", () => {
	console.log("Client disconnected");
});

server.listen(
	{
		host: "0.0.0.0",
		port: 8080,
	},
	() => {
		console.log("Server listening on 0.0.0.0:8080");
	}
);
