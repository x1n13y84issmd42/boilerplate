import * as colors from 'ansicolors';
import * as cluster from 'cluster';
import * as debug from 'debug';
import * as app from 'app';

const log = app.log('master');
const workers = {};

export default function () {
	log('Starting the Gold');

	log(
		'%s threads available, running at %sx concurrency',
		colors.brightWhite(`${app.numThreads}`),
		colors.brightWhite(`${app.numConcurrency}`),
	);

	let workerPromises: Promise<any>[] = [];

	for (let i=0; i<app.numConcurrency; i++) {
		((worker) => {
			workerPromises.push(new Promise((resolve) => {
				workers[worker.id] = {
					resolve: resolve
				};
			}));
			log('Starting up worker %d', worker.id);
		})(cluster.fork());
	}
}

// Cluster Events
cluster.on('exit', (worker: cluster.Worker, code: number, signal: string) => {
	log('Worker %d died (%s)', worker.id, signal || code);
	delete workers[worker.id];
});

cluster.on('listening', (worker: cluster.Worker, address: any) => {
	log('Worker %d is ready', worker.id);

	if (workers[worker.id].resolve) {
		workers[worker.id].resolve();
	} else {
		console.log(`Double of ${worker.id}???`);
	}

	workers[worker.id].resolve = undefined;  // Garbage collect this!
});

// Error handling during startup
function startupErrorHandler (error: Error) {
	log(error.stack || error.toString());
	process.exit(-128);
}
