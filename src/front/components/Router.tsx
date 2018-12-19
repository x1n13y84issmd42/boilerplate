import * as React from 'react';
import { Route, Switch } from 'react-router';
import Frontpage from '../layout/Frontpage';
import { NotFound } from './NotFound';

const Router = () =>
	<Switch>
		<Route exact path="/" component={Frontpage}/>
		<Route component={NotFound}/>
	</Switch>;

export default Router;
