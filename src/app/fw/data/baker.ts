import { ModelCtor } from "fw/data/types";
import * as _ from 'lodash';
import { Model } from "fw/data/model";
import * as types from "./types";
import * as app from 'app';

const log = app.log('baker');

export function model<MT extends Model>() {
	return function(ctor: types.ModelCtor, records: any[]): MT {
		return _bakeModel<MT>(ctor, records);
	}
}

export function modelArray<MT extends Model>() {
	return function(ctor: types.ModelCtor, records: any[]): MT[] {
		let res: MT[] = [];

		for (let rec of records) {
			res.push(_bakeModel<MT>(ctor, rec));
		}

		return res;
	}
}

export function remove() {
	return function(ctor: types.ModelCtor, records: any) {
		return records.result;
	}
}

export function insert<MT extends Model>() {

}

function _bakeModel<MT extends Model>(ctor: ModelCtor, rec: any): MT {
	let inst = new ctor();

	inst.id = rec._id;
	delete rec._id;
	inst = _.extend(inst, rec);

	return inst as MT;
}
