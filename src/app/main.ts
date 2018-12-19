require('app-module-path/register');
require('tsconfig-paths/register');

import * as cluster from 'cluster';
import * as colors from 'ansicolors';
import master from 'main/master';
import web from 'main/web';
import * as app from 'app';

if (cluster.isMaster && app.isProduction) {
	master();
} else {
	web();
}
