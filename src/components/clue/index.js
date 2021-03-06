import { h, Component } from 'preact';
import { route } from 'preact-router';
import MusicPlayer from 'musicplayer.js';

export default class Clue extends Component {
	state = {
		loaded: false
	}

	componentWillMount() {
		// this.boundInputKeyListener = this.inputKeyListener.bind(this);
		console.log("mounted");

		firebase.database().ref("conversations/currentState").once("value", (result) => {
			console.log("result", result.val());
			this.setState({
				loaded: true,
				clueFor: result.val()
			});
		});


		this.music = new MusicPlayer("/assets/audio/clue.mp3");
	}

	// componentDidMount() {
	// 	var inputEl = document.getElementById("clue-input");
	// 	inputEl.addEventListener("keyup", this.boundInputKeyListener);
	// 	inputEl.value = "";
	// }

	componentWillUnmount() {
		this.music.stop();
		// document.getElementById("clue-input").removeEventListener("keyup", this.boundInputKeyListener);
	}

	leaveClue() {
		setTimeout(() => {
			this.setState({
				loaded: false
			});

			this.music.fadeOut(1000);

			setTimeout(() => {
				route("/map");
			}, 1000);
		}, 500);
	}

	inputKeyListener(e) {

		if (e.keyCode === 13) {
			let val = e.target.value.trim().toLowerCase();
			if (this.state.clueFor === "wonFight" && val === "mappybday") {
				firebase.database().ref("conversations/currentState").set("haveMap");
				firebase.database().ref("map/inventory/map").set(true);
				this.leaveClue();
			} else if (this.state.clueFor === "secondIsland" && val === "surplise") {
				firebase.database().ref("map/inventory/chocolate").set(true);
				this.leaveClue();
			} else if (this.state.clueFor === "wonRace" && val === "hikelass") {
				firebase.database().ref("conversations/currentState").set("haveBoots");
				firebase.database().ref("map/inventory/boots").set(true);
				this.leaveClue();
			} else {
				e.target.value = "";
			}
		}
	}

	render() {
		return (
			<div class={'parchment' + (this.state.loaded ? ' parchment--loaded' : '')}>
				<div class={'parchment__parchment-image' + (this.state.clueFor? ' parchment__parchment-image--' + this.state.clueFor : '')}></div>
				<div class="parchment__input-wrapper">
					<p>Enter code when found:</p>
					<input type="text" id="clue-input" class="pixel-input" onKeyPress={this.inputKeyListener.bind(this)} />
				</div>
			</div>
		);
	}
};
