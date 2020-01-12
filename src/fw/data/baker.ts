import { ModelCtor } from "fw/data/types";
import * as _ from 'lodash';
import { Model } from "fw/data/model";
import * as types from "./types";
import * as app from 'app';

const log = app.log('baker');

export type SingleBakery<MT extends Model> = (ctor: types.ModelCtor, records: any) => MT;
export type ArrayBakery<MT extends Model> = (ctor: types.ModelCtor, records: any[]) => MT[];
export type Bakery<MT extends Model> = SingleBakery<MT> | ArrayBakery<MT>;

/**
 * Bakes a single model from a single record.
 */
export function model<MT extends Model>() {
	return function(ctor: types.ModelCtor, records: any): MT {
		return bakery<MT>(ctor, records);
	}
}

/**
 * Bakes an array of models from an array of records.
 */
export function modelArray<MT extends Model>() {
	return function(ctor: types.ModelCtor, records: any[]): MT[] {
		let res: MT[] = [];

		for (let rec of records) {
			res.push(bakery<MT>(ctor, rec));
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

/**
 * The bakery.
 * @param ctor A Model constructor function.
 * @param rec A record object from Mongo, can be either an object or an array.
 */
function bakery<MT extends Model>(ctor: ModelCtor, rec: any): MT {
	let inst = new ctor();

	inst.id = rec._id;
	delete rec._id;
	inst = _.extend(inst, rec);

	return inst as MT;
}
