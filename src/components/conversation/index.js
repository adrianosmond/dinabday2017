import { h, Component } from 'preact';
import { route } from 'preact-router';

export default class Conversation extends Component {
	state = {
		scene: [],
		position: 0,
		started: false,
		decided: false
	}

	componentWillMount() {
		let cid = this.props.conversationId;
		if (cid) {
			let ref = firebase.database().ref("conversations/" + cid).once("value", (result) => {
				this.setState(result.val());
				setTimeout(() => {
					this.setState({
						started: true
					});
				}, 200);
			});
		}
		this.boundKeyListener = this.keylistener.bind(this)
		document.addEventListener("keyup", this.boundKeyListener);
	}

	componentWillUnmount() {
		document.removeEventListener("keyup", this.boundKeyListener);
	}

	linkSomewhere(linkTo) {
		this.setState({
			decided: true,
			started: false
		});
		setTimeout(() => {
			route(linkTo);
		}, 2200);
	}

	keylistener(e) {
		let code = e.keyCode;
		if (this.state.scene[this.state.position].decision) {
			let decision = this.state.scene[this.state.position].decision;
			if (code >= 49 && code < 49 + decision.options.length) {
				let option = decision.options[code - 49];
				if (option.linkTo) {
					this.linkSomewhere(option.linkTo);
				} else if (option.jumpTo) {
					let idx = this.state.scene.findIndex((line) => {
						return line.id && line.id === option.jumpTo;
					});

					this.setState({
						position: idx
					});
				}
			}
		} else {
			if (code === 32) {
				this.setState({
					position: this.state.position + 1
				});

				if (this.state.scene[this.state.position].linkTo) {
					this.linkSomewhere(this.state.scene[this.state.position].linkTo);
				} 
			}
		}	
	}

	bubble(person) {
		let text = this.state.scene[this.state.position].line;
		return (
			<div class={'conversation__bubble conversation__bubble--' + person}>{text}</div>
		)
	}

	people() {
		return (
			<div class="conversation__people">
				<div class="conversation__person conversation__person--dina"></div>
				{ (this.state.scene[this.state.position].person && this.state.scene[this.state.position].person === 1) ? this.bubble("dina") : '' }
				<div class={'conversation__person conversation__person--' + this.state.person2}></div>
				{ (this.state.scene[this.state.position].person && this.state.scene[this.state.position].person === 2) ? this.bubble(this.state.person2) : '' }
			</div>
		);
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
				{ this.state.scene.length > 0? this.people() : ''}
				{ this.state.scene.length > 0 && this.state.scene[this.state.position].decision ? this.decision() : '' }
			</div>
		);
	}
};
