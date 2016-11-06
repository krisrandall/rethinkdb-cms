
var r 		 = require('rethinkdb');
var override = require('json-override');
var sanatize = function(txt) { return txt.replace(/[^0-9a-zA-Z]/g, ''); };
var defaults = require('./default-config.js');
var Cryptr 	 = require('cryptr')
var express  = require('express');
var sockio	 = require('socket.io');


var db 	    = null;
var app 	= null;
var cols  	= null;

var changeCursors = {};

var io;

function Cms() {};


Cms.prototype.setDb = function (db_handle) {
	db = db_handle;
}

Cms.prototype.setApp = function (app_prefix) {
	app = app_prefix;	
}

Cms.prototype.setCollections = function (collections) {
	cols = collections;
}


function validateState(passed_config) {

	if (db==null) 	throw("Database is null, setDb() must be called with a valid active rethinkDb");
	if (typeof(db)=='string') throw("setDb() has been set to a string, it should be set to a rethinkDb handle");

	if (cols==null) throw("Collections is null, setCollections() must be called");
	// if cols is a string then convert it to an array of just one item
	if( typeof cols === 'string' ) {
	    cols = [ cols ];
	}
	if( Object.prototype.toString.call( cols ) !== '[object Array]' ) throw("Collections is not an array, it must be an array of strings which are collections in your rethinkDb");

	if (!passed_config.port) throw("Invalid config passed, you must pass a port number if you are passing in config");

}


function activateServer(config) {

	var app = express();
	io = sockio.listen(app.listen(config.port));

}

Cms.prototype.activateFeed = function (livefeed_config, callback_to_client) {

	if (typeof(livefeed_config)=='undefined') livefeed_config = {};

	var cfg = override(defaults.LIVEFEED, livefeed_config, true);

	validateState(cfg);

	activateServer(cfg);


	// listen for socket connections
	// the connection must include an app id, and can include a updatedDts: io.connect({query:"appid=xxx&updatedDts=parsabledate"});

	io.sockets.on('connection', function(socket) {

		// check params
		if (app!=null) {
			if (socket.handshake.query.appid!=app) {
				// send error socket message back
				if (typeof(callback_to_client)!='undefined') callback_to_client({ ok: false, message: "Invalid App Id" });
				else socket.emit(cfg.topic, { ok: false, message: "Invalid App Id" });
				return;
			}
		}
		var from = null;
		if (socket.handshake.query.updatedDts) {
			from = new Date(socket.handshake.query.updatedDts);			
		}

		if (app.secret) {
			var cryptr = new Cryptr(app.secret);
		}


		// TODO : need to verify that the connection request has come from the correct app Id (mechanism to be decided, but would use secret)

		// for each collection
		for (var i=0; i<cols.length; i++) {

			let cursor_id = socket.id+'_'+cols[i];
			let table     = app + cols[i];


		    r.table(table)
		    .filter( r.row("updatedDts").gt(from) )
		    .changes({ includeInitial: true })
		    .run(db)
		    .then( function( cursor) {

	            if (cursor) {

	                changeCursors[cursor_id] = cursor;

	                cursor.each(function(err, item) {

	                    if (err) {
	                        throw(err);
	                    } else {

	                    	// emit the data back to the client (encode it if there is an app.secret set)

	                    	item.table = cols[i];
	                    	item.ok	   = true;	
	                        let encodedData = ( (app.secret) ? crypt.encode(item) : item )
	                        socket.emit(cfg.topic, item);

	                        
	                    }
	        
	                });                
	            
	            }

		    });


		    socket.on('disconnect', function () {
		        changeCursors[cursor_id].close();
		    });

		} // for each collection
	


	});

	if (typeof(callback_to_client)!='undefined') callback_to_client({ ok: true });

}


Cms.prototype.stopFeed = function() {

	for (var property in changeCursors) {
	    if (changeCursors.hasOwnProperty(property)) {

	        changeCursors[property].close();

	    }
	}

}

module.exports = Cms;
