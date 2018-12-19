
export * from './decorators';
export * from './model';
export * from './meta';

import * as connection from './connection';

export function bootstrap() {
	return connection.connect();
}

export function shutdown() {
	return connection.close();
}
