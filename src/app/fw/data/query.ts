
import { Metadata } from "fw/data/types";
import * as mquery from 'mquery';
import * as baker from 'fw/data/baker';
import * as debug from 'debug';
import { Model } from ".";

const log = debug('fw.data.query');

export type SortingArgs = {
	[field:string]:'asc'|'desc'|1|-1;
};

export class Query<MT> {
	public mq: any;
	public baker: Function;

	constructor(public meta: Metadata, collection) {
		this.mq = mquery(collection);
	}

	_find(qry?: any): this {
		this.mq.find(qry);
		return this;
	}
	
	_find1(qry?: any): this {
		this.mq.findOne(qry);
		return this;
	}

	remove(qry: any): this {
		this.mq.remove(qry);
		return this;
	}

	sort(arg: SortingArgs): this {
		this.mq.sort(arg);
		return this;
	}

	limit(v: number): this {
		this.mq.limit(v);
		return this;
	}
	
	skip(v: number): this {
		this.mq.skip(v);
		return this;
	}
	
	with(): this {
		log('The with() method is not implemented yet.');
		return this;
	}
}
