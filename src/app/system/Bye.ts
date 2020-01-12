import {Express} from 'express';
import * as debug from 'debug';

const log = debug('bye');

/**
 * Node js won't exit the process, so this subsystem exists
 * solely for when you need you application to run the
 * bootstrap sequence and exit. 
 */
export default function (xapp: Express) {
	return function() {
		return new Promise((resolve, reject) => {
			log('Bye.');
			process.exit(0);
		});
	}
}
