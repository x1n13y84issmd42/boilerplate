import { Express } from 'express';
import * as app from 'app';

const log = app.log('bootseq');

export type SysBootstrapFn = () => Promise<any>;
export type SysBootstrapFactory = (app: Express) => SysBootstrapFn;

/**
 * Boot sequence essentially defines an app configuration via the set of susbystems that make the app.
 * By combining different subsytems in a sequence, you can get different flavors of the app: a web app,
 * various kinds of CLI apps, like background services, command processors, etc from the same codebase.
 */
export class BootSequence {
	constructor(private systems: SysBootstrapFactory[]) {}

	boot(app: Express) {
		let p = Promise
			.resolve()
			;

		for (let system of this.systems) {
			p = p.then(system(app));
		}

		return p.catch(this.theCatch);;
	}

	theCatch(err) {
		log.error(err.message || err);
		process.exit(0);
	}
}
