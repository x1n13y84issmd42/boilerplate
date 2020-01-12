import {Express} from 'express';
import * as debug from 'debug';
import * as E from 'fw/Events';
// import { UserCreated } from 'lib/Auth/UserCreated';

const log = debug('events');

export default function (xapp: Express) {
	return function() {
		return new Promise((resolve, reject) => {
			// E.bind(UserCreated, Accounting.createAccount);

			log('ready');
			resolve();
		});
	}
}
