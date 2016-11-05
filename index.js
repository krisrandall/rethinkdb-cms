
var r 		 = require('rethinkdb');
var override = require('json-override');
var sanatize = function(txt) { return txt.replace(/[^0-9a-zA-Z]/g, ''); };
var defaults = require('./default-config.js');
var Cryptr 	 = require('cryptr')


/*

There is only one database,
Each "app" is created as a Colleciton with the name (prefix)+(app id)
Each document has a dataset feild added to it

*/

var db 	   = null;
var schema = null;


// database_config includes both an "apps" object which shows all the datasets and secrets 
// per app, and (optionally) rethinkdb config, also a prefix, which is the 
var cms = function (database_config) {

	var cfg = override(defaults.DATABASE, database_config, true);

	schema = database_config;

	return new Promise(resolve, reject) {

		// start the database
		r.connect( cfg.rethinkdb ).then( function(err, db_handle) {

			if (err) reject(err);
			else {
				db = db_handle;
				resolve();
			}

		});
	
	}

}


cms.prototype.admin = function (admin_config) {

	if (db==null) throw("Database is null, this must be called after cms has resolved");


}



cms.prototype.livefeed = function (livefeed_config, callback_to_client) {

	if (db==null) throw("Database is null, this must be called after cms has resolved");

	var cfg = override(defaults.LIVEFEED, livefeed_config, true);

	var changeCursors = {};

	// listen for socket connections
	// the connection must include an app id, and can include a updatedDts: io.connect({query:"appid=xxx&updatedDts=parsabledate"});

	io.sockets.on('connection', function(socket) {

		// check params
		if (!access.checkValidApp(socket.handshake.query.appid)) {
			// send error socket message back
			if (typeof(callback_to_client)!='undefined') callback_to_client({ ok: false, message: "Invalid App Id" });
			else socket.emit(cfg.topic, { ok: false, message: "Invalid App Id" });
			return;
		}
		var from = null;
		if (socket.handshake.query.updatedDts) {
			from = new Date(socket.handshake.query.updatedDts);			
		}

		let app = cfg.apps[socket.handshake.query.appid];

		var cryptr = new Cryptr(app.secret);
		
		// TODO : need to verify that the connection request has come from the correct app Id (mechanism to be decided, but would use secret)

		let cursor_id = socket.id;

		
	    r.table(table)
	    .filter( r.row("updatedDts").gt(from) )
	    .changes({ includeInitial: true })
	    .run(db_connection, function(err, cursor) {

	        if (err) {
	            throw(err);
	        } else {

	            if (cursor) {

	                changeCursors[cursor_id] = cursor;

	                cursor.each(function(err, item) {

	                    if (err) {
	                        throw(err);
	                    } else {

	                    	// emit the data back to the client (encode it if there is an app.secret set)

	                        let encodedData = ( (app.secret) ? crypt.encode(item) : item )
	                        socket.emit(cfg.topic, item);

	                        
	                    }
	        
	                });                
	            
	            }

	        }
	    });


	    socket.on('disconnect', function () {
	        changeCursors[cursor_id].close();
	    });


	});

	if (typeof(callback_to_client)!='undefined') callback_to_client({ ok: true });

}





module.exports = cms;


/*

exports

var config = {

	express: {
		port: 3000
	}

};

var express	= require('express');

var auth 	= require('http-auth');
var basic 	= auth.basic({
    realm: "Secure Area.",
    file: __dirname + "/../data/users.htpasswd"
});
 

// Application setup. 
var app = express();
app.use(auth.connect(basic));
 
// Setup route. 
app.get('/', (req, res) => {
    res.send(`Hello from express - ${req.user}!`);
});

app.listen(config.express.port, function() {
	console.log('Listening on port', config.express.port);
});

*/

