import { h, Component } from 'preact';
import { route } from 'preact-router';

class Conversation extends Component {
	state = {
		scene: [{
			"person": 1,
			"line": "Hi!"
		},{
			"person": 2,
			"line": "Hello yourself."
		},{
			"person": 1,
			"line": "Hang on a minute..."
		},{
			"person": 1,
			"line": "Are we actually having a conversation?"
		},{
			"person": 2,
			"line": "I dunno. You're doing most of the talking"
		},{
			"decision": {
				"text": "What will you do now?",
				"options": [{
					"text": "Go home",
					"linkTo": "/"
				},{
					"text": "Go home, with style",
					"linkTo": "/"
				}]
			}
		}],
		person2: "wiz",
		position: 0,
		started: false,
		decided: false
	}

	componentWillMount() {
		document.addEventListener("keyup", this.keylistener.bind(this));
	}

	componentWillUnmount() {
		document.removeEventListener("keyup", this.keylistener);
	}

	componentDidMount() {
		setTimeout(() => {
			this.setState({
				started: true
			});
		}, 500);
	}

	keylistener(e) {
		let code = e.keyCode;
		if (this.state.scene[this.state.position].decision) {
			let decision = this.state.scene[this.state.position].decision;
			if (code >= 49 && code < 49 + decision.options.length) {
				let option = decision.options[code - 49];
				if (option.linkTo) {
					this.setState({
						decided: true,
						started: false
					});
					setTimeout(() => {
						route(option.linkTo);
					}, 2200);
				}
			}
		} else {
			if (code === 32) {
				this.setState({
					position: this.state.position + 1
				});
			}
		}	
	}

	bubble(person) {
		let text = this.state.scene[this.state.position].line;
		return (
			<div class={'conversation__bubble conversation__bubble--' + person}>{text}</div>
		)
	}

	decision() {
		let decision = this.state.scene[this.state.position].decision;
		return (
			<div class={'conversation__decision' + (this.state.decided ? ' conversation__decision--done': '')}>
				<p class="conversation__decision-question">{decision.text}</p>
				<ul class="conversation__decision-options">
					{decision.options.map((opt, idx) => {
						return (
							<li class="conversation__decision-option">{idx + 1}: {opt.text}</li>
						)
					})}
				</ul>
			</div>
		);
	}

	render() {
		return (
			<div class={'conversation ' + (!this.state.started? ' conversation--not-started' : '')}>
				<div class="conversation__bg conversation__bg--2"></div>
				<div class="conversation__bg conversation__bg--3"></div>
				<div class="conversation__bg conversation__bg--4"></div>
				<div class="conversation__bg conversation__bg--5"></div>
				<div class="conversation__people">
					<div class="conversation__person conversation__person--dina"></div>
					{ (this.state.scene[this.state.position].person && this.state.scene[this.state.position].person === 1) ? this.bubble("dina") : '' }
					<div class={'conversation__person conversation__person--' + this.state.person2}></div>
					{ (this.state.scene[this.state.position].person && this.state.scene[this.state.position].person === 2) ? this.bubble(this.state.person2) : '' }
				</div>
				{ this.state.scene[this.state.position].decision ? this.decision() : '' }
			</div>
		);
	}
}

export default Conversation;
