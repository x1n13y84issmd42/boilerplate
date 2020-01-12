import * as https from 'https';
import * as app from 'app';
import * as fs from 'fs';
import * as colors from 'ansicolors';

const log = app.log('https');

export default function (app) {

	return () => {
		return new Promise((resolve, reject) => {

			var privateKey  = fs.readFileSync(process.env.SSL_KEY_PATH, 'utf8');
			var certificate = fs.readFileSync(process.env.SSL_CERT_PATH, 'utf8');
			var credentials = {
				key: privateKey,
				cert: certificate,
				passphrase: 'qweasdzxc',
			};
			
			let port = process.env.HTTPS_PORT || 4443;

			let server = https.createServer(credentials, app);
			
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
	return function(err) {
		log.error('HTTPS Error handler', err);
		reject(err);
	}
}