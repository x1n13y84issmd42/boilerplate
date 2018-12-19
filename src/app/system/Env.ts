import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as app from 'app';

export default function () {

	return new Promise((resolve, reject) => {
		let path = '.env';

		if (app.env === 'test') {
			path = '.env.test';
		}

		fs.stat(path, (err, stats: fs.Stats) => {
			if (err) {
				reject(err);
			}

			dotenv.config({
				path: path,
			});

			resolve();
		});
	});
}
