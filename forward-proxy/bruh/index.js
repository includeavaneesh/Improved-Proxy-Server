var express = require("express");
var app = express();

var requestIp = require("request-ip");

app.get("/", function (request, response) {
	var clientIp = requestIp.getClientIp(request);
	console.log(clientIp);
});

app.listen(3000, () => console.log(`App listening on port 3000`));
