
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// session
app.use(express.cookieParser());
app.use(express.session({secret: "This is a secret"}))

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));

;

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// CONNECT TO MONGODB
// mongoose.connect('mongodb://localhost/houseAndLot');
// var db = require('./model/db').init();
// var user = db.User;

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/users/signup', user.signup);
app.post('/users/singupvalidation', user.singupvalidation);

app.get('/users/login', user.login);
app.post('/users/loginvalidation', user.loginvalidation);

app.get('/users/signout', user.signout);

app.get('/users/profile', user.profile);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


/*

1.
	d:
		cd Programming\Node\mongodb\bin\
			mongod --dbpath "D:\Programming\Node\mongodb\data\db"

2.
	d:
		cd Programming\Node\mongodb\bin\
			mongo

3. 
	cd desktop\abode
		npm start


*/