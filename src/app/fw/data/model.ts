
import { meta } from 'fw/data/meta';
import { Metadata } from 'fw/data/types';
import { ObjectId } from 'bson';
import { EventEmitter } from 'events';
import * as Storage from 'fw/data/Storage';
import * as baker from 'fw/data/baker';
import * as _ from 'lodash';
import * as connection from 'fw/data/connection';

import { Query } from 'fw/data/query';
export { Query } from 'fw/data/query';

export class Model {

	private _id: ObjectId;

	constructor() {
		this.meta.name = this.constructor.name;
	}

	public save() {
		let inst = this;
		return Storage.save(this)
			.then((saved: any) => {
				if (saved.ops && saved.ops.length) {
					inst.id = saved.ops[0]._id;
				}

				return inst;
			});
	}

	public remove() {
		if (this._id) {
			return Storage.remove(this.meta, {_id: this._id});
		}
	}

	/* public static find(qry?: any) {
		return Storage.find(meta(this), qry);
	}

	public static find1(qry?: any) {
		return Storage.findOne(meta(this), qry);
	}

	public static remove(qry?: any) {
		return Storage.remove(meta(this), qry);
	} */
	
	get meta(): Metadata {
		return meta(this);
	}

	get id(): ObjectId {
		return this._id;
	}

	set id(v: ObjectId) {
		this._id = v;
	}
	
	get fields() {
		return this.meta.getFields(this);
	}
}
