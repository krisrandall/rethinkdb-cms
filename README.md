# RethinkDB-CMS



**Phase 1:** A livefeed of any changes to a rethinkdb datastore for consumption by client apps.    
**Phase 2:** Providing a bare-bones (but extensible) admin for that generic JSON datastore.      


<img src="https://raw.githubusercontent.com/krisrandall/rethinkdb-cms/master/logo.png" width="180">


## Requirements

**[RethinkDB](https://www.rethinkdb.com/)**

## Install

```
npm install rethinkdb-cms --save
```


## Phase 1

  ![](https://img.shields.io/badge/status-work_in_progress-yellow.svg)
  ![](https://api.travis-ci.org/krisrandall/rethinkdb-cms.svg?branch=master)
  
  
Admin of the RethinkDB is to be done via another mechanism.   
**I am using [chateau](https://github.com/neumino/chateau) as the CMS.**


This version of rethinkdb-cms offers a live socket feed every time something updates.


Here is a sample usage of configuring a rethinkdb-cms live feed:

```javascript
var Cms    = require('rethinkdb-cms');
var rdbcms = new Cms();
var r      = require('rethinkdb');

r.connect({ db: 'my_rethinkdb' }).then(function(rdb) {

	rdbcms.setDb(rdb);
	rdbcms.setCollections([ 'news', 'notices', 'map_locations']);
	
	rdbcms.activateFeed({ port: 4000 });
	
	rdb.table('news').insert({ 'content': 'Here is some NEW news!', 'updatedDts' : new Date() });

	// rdbcms.stopFeed();
	
});


```

And here is the HTML for a sample client app to consume that:

```html
<script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>
<script>
var socket = io.connect('http://localhost:4000');
socket.on('update', function (data) {
	console.log('I just received an update to the collection',
				  data.table, 
				  ', here is the new data:', 
				  data.new_val);
});
</script>
```



## Phase 2

  ![](https://img.shields.io/badge/status-on_hold-red.svg)
  
  
Develop the CMS ... this part of the project I do not see myself getting to in the short term ... I would love to but need to focus on feed-my-family work.

If you would love to donate to this project, I would love that, and it would mean I am able to do this Phase 2 part, which is the namesake of this npm module.


**[Make a donation via PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=EBCA9GCD7W3YJ)**




---

