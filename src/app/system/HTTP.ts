import * as http from 'http';
import * as app from 'app';
import * as colors from 'ansicolors';

const log = app.log('http');

export default function (xapp) {

	return () => {
		return new Promise((resolve, reject) => {
			
			let port = process.env.PORT || 4000;

			let server = http.createServer(xapp);
			
			server.on('error', HTTPErrorHandler(reject));

			server.listen(port, () => {
				const p = colors.brightGreen(`${port}`);
				log(`Project Gold is up & running on port ${p}`);
				resolve();
			});
		});
	};
}

function HTTPErrorHandler(reject) {
	return function (err) {
		log.error('HTTP Error handler', err);
		reject(err);
	};
}