import { h, Component } from 'preact';
import { route } from 'preact-router';

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
	}

	componentWillUnmount() {
		document.removeEventListener("keyup", this.boundKeyListener);
	}

	keylistener(e) {
		if (e.keyCode === 32) {
			this.setState({
				started: false
			});

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
					<div class="scene__person scene__person--dina scene__person--dina-walking"></div>
				</div>
				<div class="scene__instruction scene__instruction--bottom scene__instruction--blink">PRESS SPACE TO START</div>
			</div>
		);
	}
};
