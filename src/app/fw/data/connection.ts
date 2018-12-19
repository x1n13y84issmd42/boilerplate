
import * as mongo from 'mongodb';
import * as muri from 'muri';
import * as app from 'app';

export let db: mongo.Db;
export let client: mongo.MongoClient;

const log = app.log('data/connection');

export function connect() {
	return new Promise((resolve, reject) => {
		let URI = process.env.MONGODB_URI;

		if (! URI) {
			log(`MongoDB connection is not configured. See 'MONGODB_URI' in your .env file.`);
			return resolve();
		}

		let parsedURI = muri(URI);

		mongo.MongoClient.connect(URI, (err, cli) => {
			if (err) {
				log(`Connection error: ${err.message}`);
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
				return reject(err);
			}

			resolve();
		});
	});
}