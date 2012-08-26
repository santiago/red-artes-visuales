var env = process.env.NODE_ENV || 'development';

var express = require('express');
var stylus = require('stylus');
var app = module.exports = express.createServer();
var params = require('./params');

app.db = require('./models/models');
app.params = params;

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
    // Keep this as last one
    this.use(this.router);
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
    app.use(express.errorHandler());
});


app.get('/', function(req, res) {
    if (req.session.user) {
    	res.redirect('/equipamientos');
    } else {
	res.render('index');
    }
});

// Initialize Domain
require('./domain/Equipamientos')(app)
require('./domain/Participantes')(app)
require('./domain/Talleres')(app)
require('./domain/Evaluaciones')(app)
require('./domain/Consultas')(app)

// App starts here
// Only listen on $ node app.js
if (!module.parent) {
    app.listen(6600);
    console.log("Express server listening on port %d", 6600)
} else {
    if (env == 'test') app.listen(6060);
}