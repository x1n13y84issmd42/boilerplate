import * as fs from 'fs';
import * as path from 'path';
import * as app from 'app';
import * as dot from 'dot';

export function make(tplName: string) {
	const p = path.join(app.root, `src/tpl/${tplName}.html`);
	const tpl = fs.readFileSync(p);
	return dot.template(tpl);
}
