import { h, Component } from 'preact';
import { route } from 'preact-router';
import MusicPlayer from 'musicplayer.js';

export default class StartScreen extends Component {
	state = {
		started: false
	}

	componentWillMount() {
		this.boundKeyListener = this.keylistener.bind(this)
		document.addEventListener("keyup", this.boundKeyListener);

		setTimeout(() => {
			this.setState({
				started: true
			});
		}, 200);


		this.music = new MusicPlayer("/assets/audio/intro.mp3");
	}

	componentWillUnmount() {
		this.music.stop();
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
			<div class={'scene ' + (!this.state.started? ' scene--dark' : '')}>
				<div class="scene__bg scene__bg--parallax scene__bg--2"></div>
				<div class="scene__bg scene__bg--parallax scene__bg--3"></div>
				<div class="scene__bg scene__bg--parallax scene__bg--4"></div>
				<div class="scene__bg scene__bg--parallax scene__bg--5"></div>
				<div class="scene__logo"></div>
				<div class="scene__people scene__people--wide">
					<div class="scene__person-wrapper scene__person-wrapper--walking">
						<div class="scene__person scene__person--dina"></div>
					</div>
				</div>
				<div class="scene__instruction scene__instruction--bottom scene__instruction--blink">PRESS SPACE TO START</div>
			</div>
		);
	}
};
