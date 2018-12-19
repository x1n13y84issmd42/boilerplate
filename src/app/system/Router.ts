import router from 'HTTP/router';
import {Router, Request, Response } from 'express';
import * as app from 'app';
import { UserNotFoundError } from 'lib/Auth/UserNotFoundError';

const log = app.log('router');

export default function (app) {

	return () => {
		return new Promise((resolve) => {
			router.get('/*', defaultHandler);

			app.use(router);
			app.use((err, req: Request, resp: Response, next) => {
				log('Error handler');
				log(err.name);
				log(err.code);
				log(err.message);

				//TODO: important point to monitor
				//		think Slack error reporting & stuff

				if (err instanceof UserNotFoundError) {
					log('err instanceof UserNotFoundError!');
					req.logout();
					return resp.redirect('/login');
				} else {
					resp.status(~~err.code || 500).json({
						error: err.name,
						message: err.message,
						stack: (err.stack ? err.stack.split('\n'): null)
					}).end();
				}


				next && next();
			});

			resolve();
		});
	};
}

function defaultHandler(req: Request, resp: Response) {
	return resp.status(404).send('Here be dragons').end();
}
