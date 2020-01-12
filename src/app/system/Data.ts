import {Express} from 'express';
import * as d from 'fw/data';

export default function(xapp: Express) {
	return function() {
		return d.bootstrap();
	}
}
