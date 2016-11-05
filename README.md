# RethinkDB-CMS

Providing a bare-bones admin for a generic JSON datastore, and a livefeed of that datastore  for consumption by client apps.     

<img src="https://raw.githubusercontent.com/krisrandall/rethinkdb-cms/master/logo.png" width="180">



## Work in progress ...


  ![](https://img.shields.io/badge/rating-awesome-blue.svg)
  
   
   

```js
var rdbcms = require('rethinkdb-cms');
var auth   = require('http-auth');

var dataset_schema: {
			apps:{
				'demoapp': {
					collection_name: 	'demo_app',
					secret:   			'secret',
					datasets: 			[ 'dataset1', 'dataset2' ] 
				}
}

var cms = rdbcms(dataset_schema).then( function() {
	
	cms.admin();

	cms.livefeed();

});

	

```
Note that to make this example work you will need to create the `../data/user.htpasswd` file and add the "demouser" to that file.      
See [here](http://www.htaccesstools.com/htpasswd-generator/) to generate a user.htpasswd file.    
See [here](https://www.rethinkdb.com/api/javascript/) for rethinkdb configuration options (but note the `db` name will have the app id prefix added to it).


## Installation

```bash
$ npm install rethinkdb-cms --save
```

    
## Options



     
## About

All updates to the datastore are done via admin, the CMS does not support updates from client apps, and all data is sent to all app clients, there is no filtering of the data.  If these 2 restrictions do not fit your needs then you will either need to find another solution, or contribute to this repo to extend it.

RethinkDB-CMS uses [RethinkDB](https://www.rethinkdb.com/) and [socket.io](http://socket.io/). 

---
---


This is my first attempt at an NPM module, or having built in tests, or a few other things -- I welcome other contributers (that will also be a first) to join in with this project, especially anywhere I've not followed best practice.

