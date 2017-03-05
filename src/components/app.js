import { h, Component } from 'preact';
import { Router } from 'preact-router';

import Map from './map';
import Conversation from './conversation';
import Fight from './fight';

export default class App extends Component {
	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */

	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<div id="app">
				<Router onChange={this.handleRoute}>
					<Map path="/" />
					<Conversation path="/conversation/:conversationId" />
					<Fight path="/fight/" />
				</Router>
			</div>
		);
	}
}
