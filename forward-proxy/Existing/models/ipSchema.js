const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ipSchema = new Schema({
	IP: {
		type: String,
		address: String,
		required: true,
	},
});

var ipAdd = mongoose.model("ips", ipSchema);

module.exports = ipAdd;
