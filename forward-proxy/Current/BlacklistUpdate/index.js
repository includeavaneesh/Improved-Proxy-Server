const express = require("express");
const ejs = require("ejs");
const fs = require("fs");

var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
const PORT = 5000;

// app.get("/current", (req, res) => {
// 	var blacklistContent = fs
// 		.readFileSync("../blacklist", "utf-8")
// 		.split("\n")
// 		.filter((ele) => ele.length)
// 		.map((url) => url.trim());
// 	res.render("index", { blacklist: blacklistContent });
// });

app.get("/", (req, res) => {
	var blacklistContent = fs
		.readFileSync("../blacklist", "utf-8")
		.split("\n")
		.filter((ele) => ele.length)
		.map((url) => url.trim());
	res.render("index", { blacklist: blacklistContent });
});

app.post("/", (req, res) => {
	console.log(req.body);
	var newUrl = req.body.blacklist;
	var blacklistContent = fs
		.readFileSync("../blacklist", "utf-8")
		.split("\n")
		.filter((ele) => ele.length)
		.map((url) => url.trim());
	newUrl.trim();
	blacklistContent.push(newUrl);
	fs.writeFileSync("../blacklist", blacklistContent.join("\n"));
	console.log("Updated blacklist");
	res.redirect("/");
});

app.listen(PORT, () => {
	console.log(`Blacklist file listening on ${PORT}`);
});
