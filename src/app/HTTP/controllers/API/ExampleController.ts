import {Request, Response} from 'express';

export default {
	ctrler: (req: Request, resp: Response) => {
		resp.status(200).json({"data": "not much of it"});
	}
};
