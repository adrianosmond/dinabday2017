import { h, Component } from 'preact';
import { route } from 'preact-router';
import MusicPlayer from 'musicplayer.js';

export default class Travel extends Component {
	state = {
		started: false
	}

	componentWillMount() {
		this.music = new MusicPlayer("/assets/audio/intro.mp3");

		setTimeout(() => {
			this.setState({
				started: true
			});

			firebase.database().ref("conversations/currentState").set("secondIsland");
			//hide old ship x,y -> 11,10
			firebase.database().ref("map/rows/10/cols/11/character").set(null);
			//hide old pirate x,y -> 12, 10
			firebase.database().ref("map/rows/10/cols/12/character").set(null);
			//move ship x,y -> 11,13
			firebase.database().ref("map/rows/13/cols/11/character").set("ship");
			//move dina x,y -> 10,19
			firebase.database().ref("map/currentPosition").set({x: 12, y: 13});

		}, 200);

		setTimeout(() => {
			this.setState({
				started: false
			});

			this.music.fadeOut(2000);
		}, 7900);

		setTimeout(() => {
			this.music.stop();
			route("/conversation/pirate/");
		}, 9900);
	}

	render() {
		return (
			<div class={'scene scene--sea' + (!this.state.started? ' scene--dark' : '')}>
				<div class="scene__bg scene__bg--parallax scene__bg--2"></div>
				<div class="scene__bg scene__bg--parallax scene__bg--3"></div>
				<div class="scene__bg scene__bg--parallax scene__bg--4"></div>
				<div class="scene__ship-wrapper"><div class="scene__ship"></div></div>
				<div class="scene__bg scene__bg--parallax scene__bg--waves"></div>
			</div>
		);
	}
};
