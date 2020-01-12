import { Router } from 'express';
import Home from 'HTTP/controllers/Home';
import apiRouter from './api';

let router: Router = Router();

router.get('/', Home.index);
router.use('/api', apiRouter);
router.use('/login', Home.login);

export default router;
