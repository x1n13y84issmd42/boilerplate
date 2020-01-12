import { Model } from "fw/data";
import { meta } from 'fw/data/meta';
import { Metadata } from "fw/data/types";
import * as connection from 'fw/data/connection';
import { Query } from "fw/data/query";
import * as mongo from 'mongodb';
import * as baker from 'fw/data/baker';
import * as app from 'app';

const log = app.log('data.storage');

export function save(inst: Model) {
	if (inst.id) {
		return update(inst);
	} else {
		return insert(inst);
	}
}

export function insert(inst: Model) {
	let fields = inst.fields;
	
	let query: any = {};
	
	for (let f of fields) {
		query[f[0]] = f[1];
	}
	
	return connection.db.collection(inst.meta.collection).insert(query);
}

export function update(inst: Model) {
	let fields = inst.fields;
	
	let query: any = {};
	
	for (let f of fields) {
		query[f[0]] = f[1];
	}

	return connection.db.collection(inst.meta.collection).update({_id: inst.id}, query);
}

export function remove<MT extends Model>(m: Metadata, qry?: any) {
	//TODO: Implement soft deletion.
	let collection = connection.db.collection(m.collection);
	return new Query<MT>(m, collection).remove(qry);
}
