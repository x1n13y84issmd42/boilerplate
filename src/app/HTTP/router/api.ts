import { Router } from 'express';
import ExampleController from 'HTTP/controllers/API/ExampleController';

const router: Router = Router();

router.get('/files', ExampleController.ctrler);

export default router;