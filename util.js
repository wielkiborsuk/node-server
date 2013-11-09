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
    wwwbase: '../web',
    port: 8080,
    port2: 8081
}
