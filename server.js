var env = process.env.NODE_ENV || 'development';

var express = require('express');
var MongoStore = require('connect-mongo')(express);
var stylus = require('stylus');
var everyauth = require('everyauth');
var app = module.exports = express.createServer();
var params = require('./params');

app.db = require('./models/models');
app.params = params;
app.everyauth = everyauth;
app.crypt_key = 'rav_key';


everyauth.debug = true;
//Intialize authentication with username/password
require('./lib/Auth')(app)

everyauth.everymodule.findUserById(function(id, callback) {
	app.db.model('Usuario').findById(id, callback);
});


// Configuration


function compile(str, path) {
	return stylus(str).set('filename', path)
	// .set('compress', true);
}


app.configure(function() {
	this.set('views', __dirname + '/views');
	this.set('view engine', 'jade');
	this.set('view options', {
		layout: 'layout'
	})
	this.use(express.bodyParser());
	this.use(express.logger());
	this.use(express.methodOverride());
	this.use(express.cookieParser());
	this.use(express.session({ store: new MongoStore({ url: 'mongodb://173.230.141.159/red-artes-visuales' }), secret: 'Eah4tfzGAKhr' }));
    /*this.use(express.session({
		secret: 'Eah4tfzGAKhr'
	}));*/
	this.use(stylus.middleware({
		src: __dirname + '/views',
		dest: __dirname + '/public',
		compile: compile
	}));
	this.use(express.favicon(__dirname + '/public/favicon.ico', {
		maxAge: 2592000000
	}));
	this.use(express.static(__dirname + '/public'));

	this.use(everyauth.middleware());

	// Keep this as last one
	this.use(this.router);

	this.use(function(req, res, next) {
		res.render('error', {
			status: 404,
			error_text: '404 Pagina no encontrada en el sistema',
			url: req.url
		});
	});
	this.use(function(err, req, res, next) {
		console.log(err);
		res.render('error', {
			status: err.status || 500,
			error_text: '500 Error interno en el sistema',
			error: err
		});
	});


});

app.configure('development', function() {
	app.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
});

app.configure('production', function() {
	app.use(express.errorHandler());
});


app.get('/login', function(req, res) {
	res.render('login', {
		badLogin: false,
		loginError: false
	});
});

app.get('*', function(req, res, next) {
	var auth = req.session.auth;

	if (!auth || !auth.loggedIn) {
		res.redirect('/login');
	}
	else {
		next();
	}
});

app.get('/', function(req, res) {
	res.redirect('/equipamientos');
});

// Initialize Domain
require('./domain/Equipamientos')(app)
require('./domain/Participantes')(app)
require('./domain/Talleres')(app)
require('./domain/Evaluaciones')(app)
require('./domain/Consultas')(app)
require('./domain/Admin')(app);

everyauth.helpExpress(app);
// App starts here
// Only listen on $ node app.js
if (!module.parent) {
	if(env == 'production') port = 6600;
	if(env == 'development') port = 6601;
	app.listen(port);
	console.log("Express server listening on port %d", port)
	console.log(env)
}
else {
	if (env == 'test') app.listen(6602);
}