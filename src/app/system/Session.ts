import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';
import * as redis from 'connect-redis';
import * as app from 'app';
import { Express } from 'express';

const log = app.log('session');

export default function (xapp: Express) {
	return async function() {
		log.assert(process.env.SESSION_SECRET, `SESSION_SECRET is expected in process.env`);
		log.assert(process.env.SESSION_REDIS_URL, `SESSION_REDIS_URL is expected in process.env`);
		log.assert(process.env.SESSION_REDIS_DB, `SESSION_REDIS_DB is expected in process.env`);

		let ctor = redis(session);
		xapp.use(cookieParser(process.env.SESSION_SECRET));
		xapp.enable('trust proxy');

		xapp.use(session({
			store: new ctor({
				url: process.env.SESSION_REDIS_URL,
				db: ~~process.env.SESSION_REDIS_DB,
			}),
			secret: process.env.SESSION_SECRET,
			saveUninitialized: false,	//	don't create session until something stored
			resave: false,				//	don't save session if unmodified
		}));

		log('ready');
	}
}
