import * as _ from 'lodash';

/**
 * An attempt to work around the limitation of single inheritance with help of mixins.
 * Composes instances of different types into a single instance of a union type.
 */
export class Mixer<T> {
	constructor(private mixture: T) {}

	mix<MT>(mixinCtor: {new (...a):MT}, ...mixinCtorArgs): Mixer<T&MT> {
		type XT = T&MT;
		let mixin = {} as MT;
		let extendedMixture = {} as XT;
		mixinCtor.apply(mixin, mixinCtorArgs);
		_.extend(extendedMixture, this.mixture, mixin);
		return new Mixer<XT>(extendedMixture);
	}

	make(): T {
		return this.mixture;
	}
}
