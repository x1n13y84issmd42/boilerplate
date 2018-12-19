import * as app from 'app';

export type TaskOptions = {
	concurrency?: number;
	lockLimit?: number;
	lockLifetime?: number;
	priority?: number | 'lowest' | 'low' | 'normal' | 'high' | 'highest';
};

export const DEFAULT_OPTIONS: TaskOptions = {
	lockLifetime: 2 * 60 * 1000,		// 2 minutes to prevent different instances of app to schedule same tasks
};

export abstract class Task {

	private taskName: string;
	private logFn: Function;

	constructor() {
		this.taskName = this.constructor.name;
		this.logFn = app.log(this.taskName);
	}

	public log(...args:any[]) {
		for (let s of args) {
			this.logFn(s);
		}
	}

	/**
	 * Implement this and do your thing.
	 * @param job The job instance coming from Agenda.
	 */
	public abstract run(job:any):void;

	/**
	 * Just a geter.
	 */
	public getName() {
		return this.taskName;
	}

	/**
	 * This method should be called right after declaration of every task class
	 * in order to allow catching up of the jobs when app restarts.
	 */
	static bootstrap(options: TaskOptions = DEFAULT_OPTIONS) {
		/* jobs[this.name] = {
			ctor: this,
			options: options,
		}; */
	}
}

export type TaskCtor = (new () => Task);
