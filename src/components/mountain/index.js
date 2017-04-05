import { h, Component } from 'preact';
import { route } from 'preact-router';
import MusicPlayer from 'musicplayer.js';

export default class Mountain extends Component {
	state = {
		started: false
	}

	componentWillMount() {
		setTimeout(() => {
			this.setState({
				started: true
			});
		}, 200);

		this.boundKeyListener = this.keylistener.bind(this)
		document.addEventListener("keyup", this.boundKeyListener);
		window.sessionStorage.setItem("seen-a-mountain", "true");
		firebase.database().ref("conversations/currentState").set("noBoots");
		this.music = new MusicPlayer("/assets/audio/clue.mp3");
	}

	componentWillUnmount() {
		this.music.stop(2000);
		document.removeEventListener("keyup", this.boundKeyListener);
	}

	keylistener(e) {
		if (e.keyCode === 32) {
			this.setState({
				started: false
			});
			this.music.fadeOut(2000);
			setTimeout(() => {
				route("/map/");
			}, 2200);
		}
	}

	render() {
		return (
			<div class={'scene ' + (!this.state.started? ' scene--not-started' : '')}>
				<div class="scene__bg scene__bg--2"></div>
				<div class="scene__bg scene__bg--3"></div>
				<div class="scene__bg scene__bg--4"></div>
				<div class="scene__bg scene__bg--5"></div>
				<div class="scene__bg scene__bg--6"></div>
				<div class="scene__people">
					<div class="scene__person scene__person--dina"></div>
					<div class={'scene__bubble scene__bubble--dina'}>Hmm. That might be a bit steep for these shoes...</div>
				</div>
			</div>
		);
	}
};
