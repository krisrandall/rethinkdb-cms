# RethinkDB-CMS

Providing a bare-bones admin for a generic JSON datastore, and a livefeed of that datastore  for consumption by client apps.     

<img src="https://raw.githubusercontent.com/krisrandall/rethinkdb-cms/master/logo.png" width="180">



## Work in progress ...


  [![NPM Version][npm-image]][npm-url]
  [![Build Status](https://api.travis-ci.org/http-auth/http-auth.png)](https://travis-ci.org/rethinkdb-cms/rethinkdb-cms)
   
   

```js
var rdbcms = require('rethinkdb-cms')
var auth   = require('http-auth');

var config = {
	apps: [
		{
			id:	    "Demo App",
			name:   "Show what the new rethinkdb-cms is capable of",
			secret: "My App Password",
			datasets: [ "Notices", "Info", "Street Locations" ]
		} 
	],
	admin : {
		port: 4000,
		auth: {
		    realm: "Secure Area.",
		    file: __dirname + "/../data/users.htpasswd"
		},
		access: {
			"demouser": [ "Demo App" ] 
		}
	},
	livefeed : {
		port:   5000,
	}
}

var cms = rdbcms(config.apps);

cms.admin(config.admin);

cms.livefeed(config.livefeed);


```
Note that to make this example work you will need to create the `../data/user.htpasswd` file ([generate a user.htpasswd file here](http://www.htaccesstools.com/htpasswd-generator/)) and add the "demouser" to that file.


## Installation

```bash
$ npm install rethinkdb-cms --save
```

     
     
## About

All updates to the datastore are done via admin, the CMS does not support updates from client apps, and all data is sent to all app clients, there is no filtering of the data.  If these 2 restrictions do not fit your needs then you will either need to find another solution, or contribute to this repo to extend it.

RethinDB-CMS uses [RethinkDB](https://www.rethinkdb.com/) and [socket.io](http://socket.io/). 

---
---


This is my first attempt at an NPM module, or having built in tests, or a few other things -- I welcome other contributers (that will also be a first) to join in with this project, especially anywhere I've not followed best practice.


[npm-image]: https://img.shields.io/npm/v/rethinkdb-cms.svg
[npm-url]: https://npmjs.org/package/rethinkdb-cms

 
