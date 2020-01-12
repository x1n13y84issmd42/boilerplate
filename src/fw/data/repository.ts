import { Model } from 'fw/data/model';
import { meta } from 'fw/data/meta';
import { Query } from "fw/data/query";
export { Query } from "fw/data/query";
import { Metadata } from "fw/data/types";
import * as connection from 'fw/data/connection';
import * as types from "./types";
import * as debug from 'debug';
import * as baker from 'fw/data/baker';
import * as app from 'app';
import { ObjectId } from 'bson';
import * as _ from 'lodash';

export interface InsertResult {
	id: ObjectId;
}

/**
 * This class exists to let us have a properly typed Promise.then method,
 * so it can resolve to whatever value is needed at the moment instead of default `any`.
 * @see Repository
 * @see makeThen
 */
export interface Then<MT> {
	then<TResult1 = MT, TResult2 = never>(
		onfulfilled?: ((value: MT) => TResult1 | PromiseLike<TResult1>) | undefined | null,
		onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
	): Promise<TResult1 | TResult2>;
};

function makeThen<TResult1, TResult2 = never>() {
	return function(
		onfulfilled?: ((value: TResult1) => TResult1 | PromiseLike<TResult1>) | undefined | null,
		onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
	): Promise<TResult1 | TResult2>	{
		return this.mq.exec()
			.then((records: any) => {
				return records ? this.baker(this.meta.ctor, records) : null;
			})
			.then(onfulfilled)
			.catch(onrejected);
	}
}

type ModelQuery<MT> = {
	[props in keyof MT]?: MT[props];
}

/**
 * A base class for typed model repositories.
 */
export class Repository<MT extends Model> extends Query<MT> {
	private log: app.Logger;

	constructor(private ctor: types.ModelCtor) {
		super(meta(ctor), connection.db.collection(meta(ctor).collection));
		this.log = app.log(`repo<${ctor.name}>`);
	}

	save(inst: MT) {
		if (inst.id) {
			return this.update(inst);
		} else {
			return this.insert(inst);
		}
	}

	async insert(inst: MT) {
		let fields = inst.fields;
	
		let query: any = {};
	
		//TODO: replace this with storage-specific serializers used in
		//	conjunction with a repository's underlying storage implementation.
		for (let f of fields) {
			query[f[0]] = f[1];
		}
	
		try {
			//TODO: move this to the Query class
			let inserted = await connection.db.collection(inst.meta.collection).insert(query);
			return {
				id: inserted.insertedId
			};
		} catch (err) {
		//	throw new RepositoryError(err.message);
			throw new Error(err.message);
		}
	
	}

	update(inst: Model) {
		return Promise.resolve({});
	}

	/**
	 * These two replace the repo instance's then() method with a properly typed one,
	 * array or a single value.
	 * @see Then
	 * @see makeThen
	 */
	single(self: this, _baker?): this&Then<MT> {
		this.baker = _baker || baker.model<MT>();
		(this as any).then = makeThen<MT>();	//	This is boooo 
		return <this&Then<MT>> self;			//	LOL. But booo
	};
	
	multi(self: this): this&Then<MT[]> {
		this.baker = baker.modelArray<MT>();
		(this as any).then = makeThen<MT[]>();
		return <this&Then<MT[]>> self;
	};

	findOne(qry?: ModelQuery<MT>|any) {
		return this.single(super._find1(qry));
	}

	find(qry?: ModelQuery<MT>|any) {
		return this.multi(super._find(qry));
	}

	get(id: ObjectId|string) {
		let _id: ObjectId;

		if (id instanceof ObjectId) {
			_id = id;
		} else {
			_id = new ObjectId(id);
		}

		return this.single(super._find1({_id: _id}));
	}

	remove(qry?: any) {
		return this.single(super.remove(qry), baker.remove());
	}
}