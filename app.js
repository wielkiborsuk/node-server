var express = require('express'),
	fs = require('fs'),
	util = require('./util'),
	httpProxy = require('http-proxy'),
	chats = require('chat-server'),
	player = require('player-server'),
	upload = require('jquery-file-upload-middleware');

var app = express();
var https_opts = {
	key: fs.readFileSync('/home/borsuk/expr/security/server.key'),
	cert: fs.readFileSync('/home/borsuk/expr/security/server.crt')
}

var users = {
	'borsuk': 'pass',
	'foo': 'foo'
}

//var proxy = new httpProxy.RoutingProxy();
var proxy = new httpProxy.HttpProxy({
	target: {
		host: '127.0.0.1',
		port: 3000,
		https: https_opts
	},
	source: {
		host: '127.0.0.1',
		port: 3000,
		https: https_opts
	},
	https: https_opts
});

upload.configure({
	uploadDir: '../web/upload',
	uploadUrl: '/www/upload',
})

app.configure(function () {
	app.use(express.favicon())
	app.use('/upload', upload.fileHandler());
	app.use('/term', function (req, res) {
		proxy.proxyRequest(req, res);
	});
	app.use('/www', express.basicAuth(function (user, pass) {
		return user in users && users[user] == pass;
	}));
	app.use(express.bodyParser())
	app.use(express.methodOverride())
	app.use(express.cookieParser())
	app.use('/www', express.static(util.wwwbase))
	app.use('/www', express.directory(util.wwwbase, {icons:true}))
    // should be able to add self-made modules here 
    
	app.all('*', function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Range, X-Requested-With');
		if (req.method == "OPTIONS") {
			res.send(200);
		} else {
			next();
		}
	})
	app.use('/chat', chats({}))
	app.use('/player', player({basepath:'../web', defaultpath:'/upload/'}))
	
	app.use(function (req, res) {
		res.send(404)
	})
})

module.exports = app
