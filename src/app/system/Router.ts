import router from 'HTTP/router';
import {Router, Request, Response } from 'express';
import * as app from 'app';

const log = app.log('router');

export default function (xapp) {

	return () => {
		return new Promise((resolve) => {
			router.get('/*', defaultHandler);

			//	Printing the endpoints.
			xapp._router.stack.forEach((r) => {
				if (r.route && r.route.path) {
					for (let rmI in r.route.methods) {
						log(rmI.toLocaleUpperCase(), r.route.path);
					}
				}
			});

			//	Using the router
			xapp.use(router);

			//	Last line error handler
			xapp.use((err, req: Request, resp: Response, next) => {
				log.error('Error handler');
				log.error(err.name);
				log.error(err.code);
				log.error(err.message);

				resp.status(~~err.code || 500).json({
					error: err.name,
					message: err.message,
					stack: (err.stack ? err.stack.split('\n'): null)
				}).end();

				next && next();
			});

			log('ready');
			resolve();
		});
	};
}

function defaultHandler(req: Request, resp: Response) {
	return resp.status(404).send('Here be dragons').end();
}
