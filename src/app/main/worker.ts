require('app-module-path/register');

import * as debug from 'debug';
import * as colors from 'ansicolors';

import args from 'fw/args';

import Env from 'system/Env';
import * as S from 'lib/Scheduler';
import * as D from 'fw/data';
import * as app from 'app';

import * as Comm from 'lib/Comm';

const log = app.log('worker');

log('loaded');

process.on('unhandledRejection', (reason, p) => {
	log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

let i = 0;

export default function () {
	Promise.resolve()
		.then(Env)
		.then(D.bootstrap)
		.then(S.bootstrap)
		.then(Comm.bootstrap)
		.then(() => {
			setInterval(() => {
				log('working');
				i++;

				Comm.post('worker.status', {
					status: 'working',
					progress: i,
				});

			}, 2000);
		})
		.then(() => {
			log('ready');
		})
		.catch((err) => {
			log('The Last Resort Error handler');
			log(err);
			log(err.constructor.name);
	
			process.exit(-1);
		});
}
