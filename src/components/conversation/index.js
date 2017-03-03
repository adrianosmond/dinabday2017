import { h, Component } from 'preact';

class Conversation extends Component {
	state = {
		scene: [{
			"person": 1,
			"line": "Hi!"
		},{
			"person": 2,
			"line": "Hello yourself."
		},{
			"decision": {
				"1": "/",
				"2": "/"
			}
		}],
		person2: "wiz",
		position: 0
	}
	render() {
		return (
			<div class="conversation">
				<div class="conversation__people">
					<div class="conversation__person conversation__person--dina">
						<div class="conversation__bubble">Hi! This is a much longer piece of text.</div>
					</div>
					<div class={'conversation__person conversation__person--' + this.state.person2}>
						<div class="conversation__bubble">Hi!</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Conversation;
