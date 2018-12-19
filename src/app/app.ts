import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as findRoot from 'find-root';
import * as cluster from 'cluster';
import * as debug from 'debug';

//	Env config
export const env = (() => {
	let e = process.env.NODE_ENV || null;
	if (0 > ['production', 'development', 'test'].indexOf(e)) {
		e = 'development';
	}
	return e;
})();

//	Env modes
export const isDevelopment = (process.env.NODE_ENV === 'development');
export const isProduction = (process.env.NODE_ENV === 'production');
export const isTesting = (process.env.NODE_ENV === 'test');

export const PID = process.pid;
export const CID = cluster.isMaster ? 'M' : `W${cluster.worker.id}`;

export const isMaster = cluster.isMaster;
export const isWorker = cluster.isWorker;

//	App's filesystem root folder
export const root = findRoot(module.filename, (dir) => {
	return fs.existsSync(path.join(dir, '.root')); // .root is a "flag file" to find the root dir
});

//	Concurrency
export const numThreads = os.cpus().length;

export const numConcurrency: number = (function() {
	if (process.env.WEB_CONCURRENCY) {
		const webConcur = parseInt(process.env.WEB_CONCURRENCY);
		if (Number.isSafeInteger(webConcur) && webConcur > 0 && webConcur < numThreads) {
			return webConcur;
		}
	}

	return numThreads;
})();

//	Logging
export function log(m: string) {
	return debug(`${CID} [${PID}] ${m}`);
}
