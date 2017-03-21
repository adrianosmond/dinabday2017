import { h, Component } from 'preact';
import { Router } from 'preact-router';

import StartScreen from './startscreen';
import Map from './map';
import Conversation from './conversation';
import Fight from './fight';
import Clue from './clue';
import Travel from './travel';
import Mountain from './mountain';
import Race from './race';
import Card from './card';

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
					<StartScreen path="/" />
					<Map path="/map/" />
					<Clue path="/clue/" />
					<Conversation path="/conversation/:conversationId" />
					<Fight path="/fight/" />
					<Travel path="/travel/" />
					<Mountain path="/mountain/" />
					<Race path="/race/" />
					<Card path="/card/" />
				</Router>
			</div>
		);
	}
}
