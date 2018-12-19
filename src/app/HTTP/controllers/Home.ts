import {Request, Response} from 'express';
import * as app from 'app';
import * as tpl from 'lib/tpl';

export default {
	index: function(req: Request, resp: Response) {

		const devScripts = [
			'/static/react/react.development.js',
			'/static/react/react-dom.development.min.js',
		];

		const prodScripts = [
			'/static/react/react.production.js',
			'/static/react/react-dom.production.min.js',
		];

		let scripts = ['/static/app.js'];
		let styles = ['/static/app.css'];

		let render = tpl.make('front');
		let contents = render({
			scripts: scripts,
			styles: styles,
			title: '4PP',
			state: JSON.stringify({
				/* Auth: {
					user: req.user
				} */
			})
		});

		resp.set('Content-Type', 'text/html')
			.status(200)
			.send(contents)
			.end();
	},
};
