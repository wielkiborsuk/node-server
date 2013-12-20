var express = require('express'),
	fs = require('fs'),
	util = require('./util');

var app = express();

var users = {
	'borsuk': 'pass',
	'foo': 'foo'
}

app.configure(function () {
	app.use(express.favicon())

  //jquery file upload handler - didn't test it but it seems it has a problem if put to late in handler chain
  try {
    var upload = require('jquery-file-upload-middleware');
    upload.configure({
      uploadDir: '../web/upload',
      uploadUrl: '/www/upload',
    })
    app.use('/upload', upload.fileHandler());
  } catch (e) { }
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

  //chat-server - backend for simple chat engine, used to try out the publishing methods in angular
  try {
    var chats = require('chat-server');
    app.use('/chat', chats({}))
  } catch (e) { }

  //player-server - server part for angular audio player, easy private streaming
  try {
    var player = require('player-server');
    app.use('/player', player({basepath:'../web', defaultpath:'/upload/'}))
  } catch (e) { }
	
	app.use(function (req, res) {
		res.send(404)
	})
})

module.exports = app
