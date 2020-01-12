import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as findRoot from 'find-root';
import * as cluster from 'cluster';
import * as debug from 'debug';
import * as colors from 'ansicolors';

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

//	A process ID.
export const PID = process.pid;

//	A cluster ID, an identifier of a process within a cluster.
export const CID = cluster.isMaster ? 'M' : `W${cluster.worker.id}`;

export const isMaster = cluster.isMaster;
export const isWorker = cluster.isWorker;

//	Concurrency
export const numThreads = os.cpus().length;

export const numConcurrency: number = (() => {
	if (process.env.WEB_CONCURRENCY) {
		const wc = ~~process.env.WEB_CONCURRENCY;
		if (Number.isSafeInteger(wc) && wc > 0 && wc < numThreads) {
			return wc;
		}
	}

	return numThreads;
})();

//	Logging

/**
 * The Logger type.
 */
export type Logger = {
	/**
	 * Your general purpose logging function.
	 */
	(..._): (..._) => void,

	/**
	 * An error logging function. It prints the first argument in white color on the red background.
	 */
	error: (..._) => void,

	/**
	 * An assertion logger which reports errors. If the exp value evaluates to false then it prints msg as an error
	 * and executes a rejection, which can be an invocation of a literal rejection function in case
	 * it's used within a promise, otherwise an exception will be thrown with the same msg message.
	 * @param exp A value to check for truthiness.
	 * @param msg A message to show in case exp is false.
	 * @param reject An optional rejection function.
	 * @returns The exp value cast to the boolean type.
	 */
	assert: (exp, msg: string, reject?) => boolean,
};

export function log(m: string): Logger {
	let dbg = debug(`${CID} [${PID}] ${m}`);

	let logger: Logger = (function (...args) {
		dbg(...args);
	} as any);

	logger.error = function (msg: string, ...args) {
		dbg(`${colors.bgBrightRed(colors.brightWhite(msg))}`, ...args);
	};

	logger.assert = function (exp, msg: string, reject?: Function) {
		reject = reject || ((msg) => {throw new Error(msg)});

		if (!exp) {
			this.error(msg);
			reject(msg);
		}

		return !!exp;
	};

	return logger;
}
