
import { ModelCtor, ctor } from 'fw/data/types';
import { meta } from 'fw/data/meta';

/**
 * Apply to a model calss to specify the collection name where instances will be stored.
 * @param cname Collection name.
 */
export function collection(cname: string) {
	return function (ctor: ModelCtor) {
		meta(ctor).collection = cname;
	}
}

export const CREATE = 2;
export const UPDATE = 4;
export const DELETE = 8;

/**
 * A model class decorator. Used to specify timestamps for which event you'd like to have in your model.
 * @param which 
 */
export function timestamps(which: number = CREATE | UPDATE | DELETE) {
	return function (ctor: ModelCtor) {
		meta(ctor).timestamps = which;
	}
}

/**
 * A model class decorator. Enables soft deletion of model instances.
 * @param ctor 
 */
export function softDelete(ctor: ModelCtor) {
	meta(ctor).softDelete = true;
}

/**
 * A getter decorator. Use it to make the getter count when iterating over an instance proteries.
 * @param target 
 * @param propertyKey 
 * @param descriptor 
 */
export function field(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
	descriptor.enumerable = true;
}

/**
 * A property decorator. Use it to enable onChange hooks for 
 * @param target 
 * @param key 
 */
export function hook(target: any, key: string) {

	let stashKey = `_stash_${key}`;
	let hookKey = ['on', key[0].toUpperCase() + key.substring(1), 'Change'].join('');

	//	Replacing the original property with a getter/setter pair.
	Object.defineProperty(target, key, {
		get: function() {
			return this[stashKey];
		},

		set: function(v) {
			let oldV = this[stashKey];
			this[stashKey] = v;

			//	Calling the hook function
			if (typeof this[hookKey] === 'function') {
				this[hookKey].call(this, oldV, v);
			} else {
				throw new Error(`The ${key} field is decorated with a hook, but no hook method ${hookKey}() is present in the class.`);
			}
		},

		enumerable: true
	});

	//	Adding a 'stash' property to keep values
	Object.defineProperty(target, stashKey, {
		enumerable: false,
		configurable: false,
		writable: true,
	});

	//	Ignoring the stash field so it won't go to Mongo
	meta(target).ignoreField(stashKey);
}