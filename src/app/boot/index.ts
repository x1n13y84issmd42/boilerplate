import { BootManager } from "fw/BootManager";
import { BootSequence } from "fw/BootSequence";
import Env from 'system/Env';
import Events from 'system/Events';
import HTTP from 'system/HTTP';
import HTTPS from 'system/HTTPS';
import Router from 'system/Router';
import Session from 'system/Session';
import Data from 'system/Data';
import Migration from 'system/Migration';
import Bye from 'system/Bye';
import * as app from 'app';

const bootMgr = new BootManager();

bootMgr.define('web', new BootSequence([
	Env,
	Events,
	// Data,
	Session,
	HTTP,
	HTTPS,
	Router,
]));

export const boot = bootMgr;
