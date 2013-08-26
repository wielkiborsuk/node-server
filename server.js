var http = require('http'),
	https = require('https'),
	app = require('./app'),
    util = require('./util')

var port = process.env.PORT || util.port

http.createServer(app).listen(port, function () {
	console.log("Express server listening on " + port)
})
