import { Router } from 'express';
import Home from 'HTTP/controllers/Home';
import apiRouter from './api';
import staticRouter from './static';

let router: Router = Router();

router.use('/static', staticRouter);
router.use('/api', apiRouter);
router.get('/', Home.index);

export default router;
