
/*
 * GET home page.
 */
var crypto = require('crypto');

exports.index = function(req, res){

	var name = 'braitsch';
	var hash = crypto.createHash('md5').update(name).digest('hex');

	res.render('home', { title: 'Express', sample_md5hash: hash });
	// res.render('home', { title: 'Express' });
};