import * as redis from 'redis';
import * as app from 'app';

const log = app.log('comm');

export function on(handler: (...args: any[])=>void) {
	subscriber.on('message', (channel: string, data: any) => {
		handler(<Message> JSON.parse(data));
	});
}

export class Message {
	public time: Date;

	constructor(public name: string, public data: any) {
		this.time = new Date();
	}

	json() {
		return JSON.stringify(this);
	}
}

//TODO: remove hardcode
const CHANNEL = 'news';

export function post(event: string, data: any) {
	publisher.publish(CHANNEL, new Message(event, data).json());
}

let publisher: redis.RedisClient;
let subscriber: redis.RedisClient;

export function bootstrap() {
	publisher = redis.createClient(process.env.REDIS_PUB_SUB_URL);
	subscriber = redis.createClient(process.env.REDIS_PUB_SUB_URL);
	subscriber.subscribe(CHANNEL)
}
