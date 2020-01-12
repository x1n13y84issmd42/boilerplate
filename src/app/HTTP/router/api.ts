import { Router } from 'express';
import ExampleController from 'HTTP/controllers/API/ExampleController';

const router: Router = Router();

router.get('/test', ExampleController.ctrler);

export default router;