import { Express } from 'express';
import { BootSequence } from "fw/BootSequence";
import * as app from 'app';

const log = app.log('bootmgr');

export class BootManager {
	private sequences: {[k:string]: BootSequence} = {};

	define(name: string, bs: BootSequence) {
		this.sequences[name] = bs;
	}

	boot(name: string, app: Express) {
		if (this.sequences[name]) {
			log(`Executing the boot sequence: ${name}`);
			process.env.BOOT_SEQUENCE = name;
			return this.sequences[name].boot(app);
		} else {
			throw new Error(`Boot sequense '${name}' is not defined.`);
		}
	}

	listSequences() {
		return Object.keys(this.sequences);
	}
}
