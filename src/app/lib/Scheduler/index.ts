import * as Agenda from 'agenda';
import * as _ from 'lodash';
import * as app from 'app';
import { Task, TaskOptions, TaskCtor } from './Task';
import tasks from 'tasks';

let log = app.log('Scheduler');

let agenda:Agenda;
let jobs: any = {};

/**
 * Called on app start, configures the scheduler.
 */
export function bootstrap() {
	return new Promise((resolve, reject) => {
		let mongoURI = process.env.AGENDA_MONGODB_URI;
		let mongoCollection = process.env.AGENDA_MONGODB_COLLECTION;

		if (! (mongoURI && mongoCollection)) {
			log(`Scheduler is not configured. See 'AGENDA_MONGODB_URI' and 'AGENDA_MONGODB_COLLECTION' in your .env file.`);
			return resolve();
		}

		agenda = new Agenda({
			db: {
				address: mongoURI,
				collection: mongoCollection,
			},
		});

		for (let task of tasks) {
			let taskFn = ((ctor: TaskCtor) => {
				let taskName = ctor.name;
				return (job: any) => {
					//	This looks sick, I know.
					//	The task instance is passed as a data argument in the scheduling functions,
					//	saved as plain JSON objects in Mongo, then restored as plain objects, and at this point I want
					//	them as normal Task instances, but I don't have any way to reproduce the original task objects
					//	via their ctors.
					//	So, assuming that attrs.data is made from an Task instance and can be safely copied over a new instance.
					//	This is exactly why you can't have complex objects (like model instances) as Task properties.
					try {
						let task = new ctor();
						_.extend(task, job.attrs.data);
						task.run.apply(task, null);
					} catch (err) {
						log(`Scheduler failed to run ${taskName} because of ${err.message}`);
					}
				};
			})(task);
			agenda.define(task.name, taskFn);
		}

		agenda.on('ready', () => {
			log('Ready');
			agenda.start();
			resolve();
		});

		agenda.on('error', (err) => reject(err));
	});
}

export async function shutdown() {
	return new Promise((resolve) => {
		agenda.stop(() => {
			resolve();
		});
	});
}

/**
 * Basic class for scheduled tasks.
 * Basically exists to register a task in the agenda scheduler.
 */

/**
 * Schedules a task to some time.
 * @param when Date and time to schedule the task to.
 * @param task A Task instance.
 */
export function schedule(when:string|Date, task:Task) {
	log(`Scheduling ${task.getName()} @ ${when}.`);
	agenda.schedule(when, task.getName(), task);
}

/**
 * Schedules a task for periodical execution.
 * @param when Date and time to schedule the task to.
 * @param task A Task instance.
 */
export function every(when:string, task:Task) {
	log(`Scheduling ${task.getName()} to every ${when}.`);
	return agenda.every(when, task.getName(), task);
}

/**
 * Cancels a task from the schedule.
 * @param task A Task instance.
 */
export function cancel(task:Task) {
	log(`Cancelling the ${task.getName()} task.`);
	return agenda.cancel({name: task.getName()});
}

/**
 * Schedules and immediately executes a task.
 * @param task A Task instance.
 */
export function now(task:Task) {
	log(`Scheduling ${task.getName()} @ now.`);
	agenda.now(task.getName(), task);
}

export function add(ctor: TaskCtor, options?: TaskOptions) {
	jobs[ctor.name] = {
		ctor,
		options 
	};
}

export { Task } from './Task';
