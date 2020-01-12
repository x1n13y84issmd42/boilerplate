
import * as mongo from 'mongodb';
import * as muri from 'muri';
import * as app from 'app';

export let db: mongo.Db;
export let client: mongo.MongoClient;

const log = app.log('data/connection');

export function connect() {
	return new Promise((resolve, reject) => {
		if(! log.assert(process.env.MONGODB_URI, "MONGODB_URI is expected in process.env", reject)) return;

		let URI = process.env.MONGODB_URI;
		let parsedURI;
		
		try {
			parsedURI = muri(URI);
		} catch (err) {
			log.error(`Mongo URI error: ${err.message}`);
			return reject(err);
		}

		mongo.MongoClient.connect(URI, {
			useNewUrlParser: true
		}, (err, cli) => {
			if (err) {
				log.error(`MongoClient connection error: ${err.message}`);
				return reject(err);
			}
			
			log(`Connection is up.`);
			client = cli;
			resolve(db = cli.db(parsedURI.db));
		});
	});
}

export function close() {
	return new Promise((resolve, reject) => {
		client && client.close((err, res) => {
			if (err) {
				log.error(`MongoClient connection close error: ${err.message}`);
				return reject(err);
			}
			
			log(`Connection is down.`);
			resolve();
		});
	});
}