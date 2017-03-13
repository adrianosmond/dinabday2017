import { h, Component } from 'preact';
import { route } from 'preact-router';

export default class Travel extends Component {
	state = {
		started: false
	}

	componentWillMount() {
		setTimeout(() => {
			this.setState({
				started: true
			});
		}, 200);

		setTimeout(() => {
			this.setState({
				started: false
			});
		}, 7900);

		setTimeout(() => {
			route("/map/");
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
