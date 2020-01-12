
import * as d from 'fw/data';
import * as fs from 'fs';
import * as path from 'path';
import * as rgb from 'ansicolors';
import * as debug from 'debug';
import { Repository } from 'fw/data/repository';

const log = debug('migrate');

export type migrationFile = {
	n: number;
	name: string;
	filename: string;
};

@d.collection(process.env.DBLISM_MIGRATION_COLLECTION || 'migrations')
export class migration extends d.Model {
	public applied: Array<migrationFile> = [];
	public date: Date;
	
	constructor() {
		super();

		this.date = new Date();
	}
}

export class migrations extends Repository<migration> {
	constructor() {
		super(migration);
	}
}

export async function up() {
	log(`Going up`);
	const mgrtns = new migrations();
	let last = (await (mgrtns.findOne().sort({date: 'desc'}).limit(1))) || new migration();
	let dir = process.env.DBLISM_MIGRATION_DIRECTORY || 'migrations';
	let files = readMigrationFiles(dir, 'js');
	let lastIndex = last.applied.length ? last.applied[last.applied.length - 1].n : 0;
	
	let current = new migration();
	
	for (let mfI = 0; mfI < files.length && lastIndex >= 0; mfI++) {
		if (files[mfI].n > lastIndex) {
			log(`Migrating ${files[mfI].name}`);
			let fn = path.resolve(`${dir}/${files[mfI].filename}`);
			let mm = require(fn);
			await mm.up(()=>{});
			current.applied.push(files[mfI]);
		}
	}
	
	if (current.applied.length) {
		await current.save();
		log('Done.');
	} else {
		log(`We're up to date.`);
	}
}

export async function down() {
	log(`Going down`);
	const mgrtns = new migrations();
	let last = await mgrtns.findOne().sort({date: 'desc'}).limit(1);
	let dir = process.env.DBLISM_MIGRATION_DIRECTORY || 'migrations';

	if (last) {
		for (let mfI = last.applied.length - 1; mfI >= 0; mfI--) {
			let fn = path.resolve(`${dir}/${last.applied[mfI].filename}`);
			try {
				if (fs.lstatSync(fn).isFile()) {
					log(`Rolling back ${last.applied[mfI].name}`);
					let mm = require(fn);
					await mm.down(()=>{});
				}
			} catch (err) {
				log(`Error on ${last.applied[mfI].filename}, ${err.message}`);
			}
		}
		await mgrtns.remove({_id: last.id});
		log('Done.');
	} else {
		log(`We're clean.`);
	}
}

let migrationTpl = `

export async function up() {
	//TODO: migration code
}

export async function down() {
	//TODO: rollback code
}

`;

export async function create(name: string) {

	let dir = process.env.DBLISM_MIGRATION_DIRECTORY || 'migrations';
	let files = readMigrationFiles(dir);

	let mn = files.length ? (files[files.length - 1].n + 1) : 1;
	
	let fn = makeMigrationName(mn, name);
	fn = `${dir}/${fn}`;
	log(`Creating ${fn}`);

	fs.writeFileSync(fn, migrationTpl);
	log('done.');

	return Promise.resolve(1);
}

function readMigrationFiles(dir: string, ext = 'ts'): migrationFile[] {
	let files = fs.readdirSync(dir);

	let mgRx = new RegExp(`^(\\d+)-.*?\.${ext}$`, 'gi');
	let xfiles: migrationFile[] = [];

	for (let file of files) {

		let n;

		if (n = file.match(mgRx)) {
			xfiles.push({
				n: parseInt(n),
				name: path.basename(file, `.${ext}`),
				filename: file,
			});
		}
	}

	xfiles.sort((a: migrationFile, b: migrationFile): number => {
		return a.n - b.n;
	});

	return xfiles;
}

function makeMigrationName(n: number, name: string): string {
	let sn = (n+'').padStart(3, '0');
	return `${sn}-${name}.ts`;
}