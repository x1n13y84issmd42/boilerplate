import {Request, Response} from 'express';
import * as app from 'app';

export default {
	index: function(req: Request, resp: Response) {
		resp.set('Content-Type', 'text/html')
			.status(200)
			.send("<center><h1 style='font-size:16em'>/</h1></center>")
			.end();
	},
};
