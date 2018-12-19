import * as React from 'react';
import * as ReactDOM from "react-dom";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Router from './components/Router';
import { Store as TheStore } from './Store';
import onload from './onload';

import './scss/front.scss';

if ((window as any).TheInitialState) {
	onload((window as any).TheInitialState);
}

ReactDOM.render(
	<Provider store={TheStore}>
		<BrowserRouter>
			<Router/>
		</BrowserRouter>
	</Provider>,
	document.getElementById("app")
);
