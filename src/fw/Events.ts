/**
 * A basic class for your events.
 */
export class Event {
	public constructor() {
	}

	public get name() {
		return this.constructor.name;
	}
}

/**
 * Storage for handlers.
 */
let storage: Object = {};

/**
 * Your way to fire events.
 * @param e An event instance.
 */
export function fire(e: Event) {

	if (storage.hasOwnProperty(e.name)) {
		for (let eI in storage[e.name]) {
			storage[e.name][eI](e);
		}
	}
}

/**
 * Your way to bind handlers to event types.
 * @param e An event class.
 * @param handler A handler function.
 */
export function bind<ET extends Event>(e: ET, handler: (e: Event)=>void) {

	if (! storage.hasOwnProperty(e.name)) {
		storage[e.name] = [];
	}

	storage[e.name].push(handler);
}
