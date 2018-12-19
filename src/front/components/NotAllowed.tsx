import * as React from 'react';

export class NotAllowed extends React.Component<any, any> {
	render() {
		return <div className="row">
			<h1 className="small-12 medium-6 large-6">You are not allowed here. 403. Go away.</h1>
			<small>Why are you still here?</small>
		</div>
	}
}
