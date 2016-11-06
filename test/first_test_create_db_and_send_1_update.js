var chai = require('chai'),
    mocha = require('mocha'),
    should = chai.should();

var io = require('socket.io-client');

var global_db_handle;
var testdbname = 'mytestdb';
var appname = 'testapp_';
var newscontent = 'whatever';


var Cms    = require('../index.js');
var rdbcms = new Cms();


var r;

describe("create db, start feed, make update, listen for update", function () {

    var server,
        options ={
            transports: ['websocket'],
            'force new connection': true
        };

    beforeEach(function (done) {
        // create DB and add "news" collection
        r = require('rethinkdb');

        r.connect(function(err, conn) {

            if (err) {
                console.log('didnt connect, is rethinkdb running?')
                throw err;
            }

            console.log('connected to rethink!');
            
            global_db_handle = conn;

            r.dbCreate(testdbname).run(conn)
            .then(function() {


                console.log('created DB:', testdbname);

                r.connect({ db: testdbname}).then(function(conn) {

                    console.log('connected to socket');

                    r.db(testdbname).tableCreate(appname+'news').run(conn)
                    .then(function() {

                        console.log('created table!');

                        // start the server


                        rdbcms.setDb(conn);
                        rdbcms.setCollections('news');
                        rdbcms.setApp(appname);

                        console.log('activating feed...');

                        rdbcms.activateFeed();

                        console.log('creating news item...');
                        r.table(appname+'news').insert({ 'content': newscontent, 'updatedDts' : new Date() }).run(conn)
                        .then(function() {

                            console.log('made the news record ok!');
                            console.log('"beforeEach" phase "done"');
                            done();

                        })

                    })

        
                })

            }); 


        });
    });

    afterEach(function(done) {

        // stop server
        rdbcms.stopFeed();

        // destroy database
        r.dbDrop(testdbname).run(global_db_handle)
        .then(function() {
    
            done();

        })


    });

    it("receives update", function (done) {

        console.log('running "receives update"...');

        var client = io.connect("http://localhost:4000?appid="+appname, options);

        client.once("connect", function () {

            console.log('connected to socket ok ..');

            client.once("update", function (message) {

                console.log('!!!', message);

                message.ok.should.equal(true);

                message.new_val.content.should.equal(newscontent);
                
                client.disconnect();
                done();
            });

        });
    });
    
});