import { Model } from "fw/data/model";

export class Metadata {
	name: string;
	ctor: ModelCtor;

	collection: string;
	timestamps = 0;
	softDelete = false;

	ignoredFields: Array<string> = [];

	ignoreField(fn: string) {
		this.ignoredFields.push(fn);
	}

	isFieldIgnored(fn: string) {
		return this.ignoredFields.indexOf(fn) !== -1;
	}

	getFields(inst: Model): Array<[string, any]> {
		let pairs: Array<[string, any]> = [];
		let meta = this;
		
		for (let fI in inst) {

			if (! meta.isFieldIgnored(fI)) {

				let value = inst[fI]

				if (value instanceof Model) {
					if (value.id) {
						pairs.push([fI, value.id]);
					}
				} else {
					pairs.push([fI, inst[fI]]);
				}
			}
		}

		return pairs;
	}
};

export type ModelCtor = {new (...args): Model};
export type ctor<T> = {new (...args): T};
