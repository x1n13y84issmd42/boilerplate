/* tslint:disable */

require('app-module-path/register');
require('tsconfig-paths/register');

import Env from 'system/Env';
import * as D from 'fw/data';
import * as S from 'lib/Scheduler';
import * as fs from 'fs';
import * as app from 'app';
import {join} from 'path'

var args = process.argv.slice(2);

if (args.length === 0) {
	args = ['up'];
}

Env();

import * as migrate from 'fw/data/migration';

const log = app.log('migrate');

process.on('unhandledRejection', (reason, p) => {
	log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

(async function () {

	try {
		await D.bootstrap();
		await S.bootstrap();
	
		let op = args.shift();
	
		switch (op) {
			case 'create':
			process.chdir(process.env.DBLISM_MIGRATION_CREATE_CWD || 'src');
			await migrate.create(args.join('-'));
			break;
			
			case 'up':
			process.chdir(process.env.DBLISM_MIGRATION_APPLY_CWD || 'out');
			await migrate.up();
			break;
			
			case 'down':
			process.chdir(process.env.DBLISM_MIGRATION_APPLY_CWD || 'out');
			await migrate.down();
			break;
		}

		await D.shutdown();
	//	await S.shutdown();
		process.exit(0);

	} catch (error) {
		log(error.message);
		log(error.stack || error.toString());
		process.exit(-128);
	}
})();
