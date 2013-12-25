var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/houseAndLot');
var models = mongoose.models;


exports.users = function() {

	var UserSchema = new mongoose.Schema({
		email: String,
		password: String,
		role: Number
	});

	 return mongoose.models;

};