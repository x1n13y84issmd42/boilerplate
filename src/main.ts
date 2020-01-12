require('tsconfig-paths/register');

import * as express from 'express';
import * as debug from 'debug';
import * as app from 'app';
import args from 'fw/args';
import {boot} from 'booot';

const log = app.log('main');
const xapp = express();

process.on('unhandledRejection', (reason, p) => {
	log.error('Unhandled Rejection', 'at: Promise', p, 'reason:', reason);
});

if (args[0]) {
	boot.boot(args[0], xapp);
} else {
	log.error(`No boot sequence name was provided.`, `The following sequences are available:`, boot.listSequences());
}
