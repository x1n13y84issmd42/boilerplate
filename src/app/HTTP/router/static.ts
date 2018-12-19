import * as path from 'path';
import * as app from 'app';

import {
	Router,
	static as serveStatic,
} from 'express';

const staticRoute: Router = Router();

staticRoute.use('/react', serveStatic(path.join(app.root, 'node_modules/react/cjs/')));
staticRoute.use('/react', serveStatic(path.join(app.root, 'node_modules/react-dom/cjs/')));

staticRoute.use('/', serveStatic(path.join(app.root, 'out/dist')));

export default staticRoute;
