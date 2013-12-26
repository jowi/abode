
/*
 * GET users listing.
 */
// http://stackoverflow.com/questions/5878682/node-js-hash-string
// http://docs.mongodb.org/manual/reference/operator/
http://stackoverflow.com/questions/19886736/how-to-find-documents-with-nodejs-and-mongoose-why-there-is-no-result

var mongoose = require('mongoose');
var crypto = require('crypto');
var util = require('util');


mongoose.connect('mongodb://localhost/houseAndLot');

var UserSchema = new mongoose.Schema({
		email: String,
		password: String,
		role: Number
});

Users = mongoose.model('Users', UserSchema);


exports.list = function(req, res){
	res.send("respond with a resource");
};

exports.signup = function(req, res){

	var inputtedvalues = new Array();
	inputtedvalues['email'] = '';

	res.render('signup',{'inputtedvalues': inputtedvalues});
};

exports.singupvalidation = function(req, res){


	var email = req.body.email;
	var password = req.body.password;
	var confirmpassword = req.body.confirmpassword;


	var inputtedvalues = new Array();
	inputtedvalues['email'] = email;


	Users.count({email: email},function(err, obj) {

		if( obj > 0 ) {
			res.render('signup', { error: 'existing_email', message: 'Email already registered.', inputtedvalues: inputtedvalues });
		}
		else if( email == "" ) {
		res.render('signup', { error: 'no_email', message: 'Please provide an email address.', inputtedvalues: inputtedvalues });
		}
		else if( password == "" ) {
			res.render('signup', { error: 'password_mismatch', message: 'Please provide a password', inputtedvalues: inputtedvalues });
		}
		else if( password != confirmpassword ) {
			res.render('signup', { error: 'password_mismatch', message: 'Password mismatch.', inputtedvalues: inputtedvalues });
		}
		else {

			new Users({
				email: email,
				password: crypto.createHash('md5').update(password).digest('hex'),
				role: 1,
			}).save(function(err, user){

				if(err) res.json(err);

					res.render('signup', { error: 'none', message: email, inputtedvalues: inputtedvalues });
			});
		}
	});

	
};


exports.login = function(req, res) {

	var inputtedvalues = new Array();
	inputtedvalues['email'] = '';

	res.render('login', {'inputtedvalues': inputtedvalues});
}

exports.loginvalidation = function(req, res) {

	var email = req.body.email;
	var password = crypto.createHash('md5').update(req.body.password).digest('hex');

	var inputtedvalues = new Array();
	inputtedvalues['email'] = email;

	Users.count({email: email, password: password},function(err, obj) {

		if( obj != 0) {
			req.session.email = email;
			// res.send(req.session.email);
			res.render('home', { title: 'Express', email_session: req.session.email });
		}
		else
			res.render('login', { error: 'invalid_login', message: 'Invalid email or password.', inputtedvalues: inputtedvalues });
	});


}

exports.signout = function(req, res) {

	req.session.destroy();

	res.render('home', { title: 'Express'});
}

exports.profile = function(req, res) {


	if( req.session.email != null ) {

		var email = req.session.email;

		Users.find({email: email}, function(err, infos) {
			console.log(infos);
			res.render('profile', { infos: infos });
		});
	}
	else {
		res.send("Please Login");
	}
}

exports.updateprofile = function(req, res) {

	var email = req.body.email;
	var password = req.body.password;
	var confirmpassword = req.body.confirmpassword;

		Users.find({email: email}, function(err, infos) {

			if( password == "" ) {
				res.render('profile', { error: 'password_mismatch', message: 'Please provide a password', infos: infos  } );
			}
			else if( password != confirmpassword ) {
				res.render('profile', { error: 'password_mismatch', message: 'Password mismatch.', infos: infos  } );
			}else {

				password = crypto.createHash('md5').update(password).digest('hex');

				Users.update(
					{ email: email },
					{ password: password },
					function ( err ) {
						res.render('profile', { error: 'none', message: 'Password updated.', infos: infos  } );
					}
				);
			}
		});
}

/*TODO: learn how to get count from db*/