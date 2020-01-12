import {Express} from 'express';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as app from 'app';

const log = app.log('env');

export default function (xapp: Express) {
	return function() {
		return new Promise<any>((resolve, reject) => {
			//	First, trying to load a boot sequence-specific env file.
			//	It's like this because dotenv won't overwrite already existing values in process.env.
			if (process.env.BOOT_SEQUENCE) {
				let bsEnvPath = `${process.env.BOOT_SEQUENCE}.env`;
				if (fs.existsSync(bsEnvPath)) {
					log(`Loading the ${bsEnvPath}`);
					dotenv.config({
						path: bsEnvPath,
					});
				}
			}
	
			log(`Loading the .env`);
			
			//	Then loading the default one.
			let res = dotenv.config({
				path: '.env',
			});

			if (res.error) {
				log.error(res.error.message || res.error);
				return reject(res.error)
			}
			
			log('ready');
			resolve();
		});
	}
}
