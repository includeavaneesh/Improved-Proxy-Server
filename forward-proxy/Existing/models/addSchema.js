const mongoose = require("mongoose");
var Schema = mongoose.Schema;

var addressSchema = new Schema({
	IP: {
		type: String,
		address: String,
		required: true,
	},
});

var Address = mongoose.model("addresses", addressSchema);

module.exports = Address;
