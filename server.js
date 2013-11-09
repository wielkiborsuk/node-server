var http = require('http'),
	https = require('https'),
	app = require('./app'),
	util = require('./util'),
	fs = require('fs')

var port = process.env.PORT || util.port
var options = {
	key: fs.readFileSync('/home/borsuk/expr/security/server.key'),
	cert: fs.readFileSync('/home/borsuk/expr/security/server.crt')
}

http.createServer(app).listen(port, function () {
	console.log("Express server listening on " + port);
})

https.createServer(options, app).listen(util.port2, function () {
	console.log("Https version listens on " + util.port2);
})
