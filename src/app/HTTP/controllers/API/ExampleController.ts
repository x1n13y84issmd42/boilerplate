import {Request, Response} from 'express';

export default {
	ctrler: (req: Request, resp: Response) => {
		resp.status(200).send('File API ctrler');
	}
};
