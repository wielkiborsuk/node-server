module.exports = {
	extend: function extend(child, parent) {
		function tmp() { this.constructor = child }
		tmp.prototype = parent.prototype
		child.prototype = new tmp()
	},
	errlog: function errlog(error) {
		if (error) {
			console.log('DB.ERROR: ' + error);
		}
	},
	dump: function dump(obj) {
		console.log(obj);
		try {
			for (var n in obj) {
				console.log(n + " : " + obj[n]);
			}
		} catch (e) {}
	},
	jsonvalid: function jsonvalid(req, res) {
		if (!req.is('json')) {
			res.send(415)
			return true
		}
		if (!req.body) {
			res.send(400, "Request cannot be empty")
			return true
		}
		return false
	},
	erres: function erres(err, res) {
		if (err) {
			res.send(500)
			return true
		}
		return false
	},
  defaultHandler: function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
		res.header('Access-Control-Allow-Headers', 'Content-Type, Range, X-Requested-With');
		if (req.method == "OPTIONS") {
			res.send(200);
		} else {
			next();
		}
	},
  www : {
    base: '../web',
    url: '/www',
    port: 8080,
    port2: 8081
  },
  users: {
    'borsuk': 'pass',
    'foo': 'foo'
  },
  upload: {
    uploadDir: '../web',
    uploadUrl: '/www/upload',
    url: '/upload',
  },
  chat: {
    url: '/chat'
  },
  player: {
    url: '/player',
    basepath: '../web',
    defaultpath: '/upload/'
  },
  poet: {
    url: '/weblog',
    path: '../poet-web-log',
    config: {
      posts: '../poet-web-log/posts',
      metaFormat: 'json',
      postsPerPage: 5,
      routes: {
        '/weblog/posts/:post': 'post',
        '/weblog/tags/:tag': 'tag',
        '/weblog/pagination/:page': 'page',
        '/weblog/categories/:category': 'category'
      }
    }
  }
}
