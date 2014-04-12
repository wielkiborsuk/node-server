var express = require('express');
var fs = require('fs');
var util = require('./util');

var app = express();

app.configure(function () {
  app.use(express.favicon())

  //jquery file upload handler - didn't test it but it seems it has a problem if put to late in handler chain
  try {
    var upload = require('jquery-file-upload-middleware');
    upload.configure(util.upload)
    app.use(util.upload.url, upload.fileHandler());
  } catch (e) { }
  app.use(util.www.url, express.basicAuth(function (user, pass) {
    var users = util.users;
    return user in users && users[user] == pass;
  }));
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(express.cookieParser())

  //video player for a single video directory with a simple playlist na auto loop option
  try {
    var videoView = require('custom-video-engine');
    app.use(util.video.url, videoView({ap: app, prefix: util.video.url, path: util.video.path}));
  } catch (e) { }

  app.use(util.www.url, express.static(util.www.base))
  app.use(util.www.url, express.directory(util.www.base, {icons:true}))
  app.all('*', util.defaultHandler)

  //chat-server - backend for simple chat engine, used to try out the publishing methods in angular
  try {
    var chats = require('chat-server');
    app.use(util.chat.url, chats({}))
  } catch (e) { }

  //player-server - server part for angular audio player, easy private streaming
  try {
    var player = require('player-server');
    app.use(util.player.url, player(util.player))
  } catch (e) { }

  // POET - initialization of poet
  try {
    var poet = require('poet')(app, util.poet.config);
    poet.init(function () { });
    app.set('view engine', 'jade');
    app.set('views', util.poet.path+'/views');
    app.use(express.static(util.poet.path+'/public'));
    app.get(util.poet.url, function (req, res) { res.render('index'); });
  } catch (e) { }

  app.use(function (req, res) {
    res.send(404)
  })
})

module.exports = app
