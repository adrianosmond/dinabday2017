import { h, Component } from 'preact';
import { route } from 'preact-router';
import MusicPlayer from 'musicplayer.js';

export default class Card extends Component {
	state = {
		loaded: false
	}

	componentWillMount() {
		this.setState({
			loaded: true
		});

		this.music = new MusicPlayer("/assets/audio/conversation.mp3");
	}

	render() {
		return (
			<div class={'parchment' + (this.state.loaded ? ' parchment--loaded' : '')}>
				<div class="parchment__parchment-image parchment__parchment-image--endGame"></div>
			</div>
		);
	}
};
