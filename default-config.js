
module.exports = {

		DATABASE : {
			rethinkdb : {
				db: 'rdbcms'
			},

			apps:{

				'demoapp': {
					collection_name: 	'demo_app',
					secret:   			'secret',
					datasets: 			[ 'dataset1', 'dataset2' ] 
				}

			}

			
		},

		ADMIN : {
			port: 5000,

		},

		LIVEFEED: {
			port: 5001,
			topic: 'update'
		
		}

}
