import { Router } from 'express';
import Home from 'HTTP/controllers/Home';
import apiRouter from './api';

let router: Router = Router();

router.use('/api', apiRouter);
router.get('/', Home.index);

export default router;
