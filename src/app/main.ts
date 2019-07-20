require('app-module-path/register');
require('tsconfig-paths/register');

import * as express from 'express';
import Env from 'system/Env';
import HTTP from 'system/HTTP';
import HTTPS from 'system/HTTPS';
import Router from 'system/Router';
import Session from 'system/Session';
import * as app from 'app';

const xapp = express();
const log = app.log('web');

process.on('unhandledRejection', (reason, p) => {
	log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

Promise.resolve()
	.then(Env)
	.then(Session(xapp))
	.then(HTTP(xapp))
	.then(HTTPS(xapp))
	.then(Router(xapp))
	.catch((err) => {
		log('Startup Error handler');
		log(err);

		process.exit(-1);
	});
