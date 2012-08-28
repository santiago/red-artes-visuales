var env = process.env.NODE_ENV || 'development';

var express = require('express');
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

everyauth.password
  .findUserById( function (id, callback) {
    console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%***");
    Usuario.findById(id, callback);    
  });


// Configuration
function compile(str, path) {
    return stylus(str)
	.set('filename', path)
	// .set('compress', true);
}


app.configure(function(){
    this.set('views', __dirname + '/views');
    this.set('view engine', 'jade');
    this.set('view options', { layout: 'layout' })
    this.use(express.bodyParser());
    this.use(express.logger());
    this.use(express.methodOverride());
    this.use(express.cookieParser());
    this.use(express.session({secret: 'Eah4tfzGAKhr'}));
    this.use(stylus.middleware({
	      src: __dirname + '/views'
        , dest: __dirname + '/public'
        , compile: compile
    }));
    this.use(express.favicon(__dirname + '/public/favicon.ico', { maxAge: 2592000000}));
    this.use(express.static(__dirname + '/public'));
    this.use(everyauth.middleware());
    // Keep this as last one
    this.use(this.router);
    this.use(function(req, res, next){
      res.render('error', { status: 404, error_text: '404', url: req.url });
    });
    this.use(function(err, req, res, next){
      res.render('error', {
        status: err.status || 500
      , error_text: '500'
      ,   error: err
    });
});


});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler());
});


app.get('/login', function(req, res){
  res.render('login', {
    badLogin: false,
    loginError: false
  });
});

app.get('*', function(req, res, next) {
//  console.log(everyauth);
    if (!req.session.auth) {
        res.redirect('/login');
    } else { 
//      console.log("alskdjföalskdfjö");
      next();
    }
});

app.get('/', function(req, res) {
    if (req.session.user) {
      console.log('redirecting..................');
    	res.redirect('/equipamientos');
    } else {
      console.log('rendering index..................');
      console.log(everyauth.loggedIn);
	    res.render('index', {
        locals:{
          articulo: 'None'
        }
      });
    }
});

// Initialize Domain
require('./domain/Equipamientos')(app)
require('./domain/Participantes')(app)
require('./domain/Talleres')(app)
require('./domain/Evaluaciones')(app)
require('./domain/Consultas')(app)
require('./domain/Admin')(app)

everyauth.helpExpress(app);
// App starts here
// Only listen on $ node app.js
if (!module.parent) {
    app.listen(6600);
    console.log("Express server listening on port %d", 6600)
} else {
    if (env == 'test') app.listen(6060);
}
