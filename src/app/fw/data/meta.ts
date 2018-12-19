import { Model } from "fw/data";
import { ModelCtor, Metadata } from "fw/data/types";

let metaStorage: any = {};

export function meta<T extends Model | ModelCtor> (m: T): Metadata {
	let name: string;
	let ctor: ModelCtor;
	
	if (typeof m === 'function') {
		name = (m as ModelCtor).name;
		ctor = m as ModelCtor;
	} else {
		name = m.constructor.name;
	}

	if (metaStorage[name] === undefined) {
		let md = new Metadata();
		md.name = name;
		md.ctor = ctor;

		metaStorage[name] = md;
	}

	return metaStorage[name];
}
