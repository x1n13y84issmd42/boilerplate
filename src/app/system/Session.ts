import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as redis from 'connect-redis';
import * as app from 'app';
import { Express } from 'express';

const log = app.log('session');

export default function (app: Express) {
	return function() {
		let ctor = redis(session);
		app.use(cookieParser(process.env.SESSION_SECRET));
		app.enable('trust proxy');

		app.use(session({
			store: new ctor({
				url: process.env.SESSION_REDIS_URL,
				db: ~~process.env.SESSION_REDIS_DB,
			}),
			secret: process.env.SESSION_SECRET,
			saveUninitialized: false, // don't create session until something stored
			resave: false, //don't save session if unmodified
		}));

		log('ready');
	}
}
