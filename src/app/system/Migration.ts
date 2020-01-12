import {Express} from 'express';
import * as debug from 'debug';
import * as app from 'app';
import * as migrate from 'fw/data/migration';

const log = app.log('migration');

export default function (xapp: Express) {
	return function() {
		return new Promise(async (resolve, reject) => {

			var args = process.argv.slice(3);

			if (args.length === 0) {
				args = ['up'];
			}
			
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

				default:
					log.error(`'${op}' is an unknown operation.`);
					log(`Known operations are:\n\tup (the default one)\n\tdown\n\tcreate ARBITRARY MIGRATION NAME`);
				break;
			}
			resolve();
		});
	}
}
