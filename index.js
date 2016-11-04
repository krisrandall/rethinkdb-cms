

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

