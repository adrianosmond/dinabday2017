import { h, Component } from 'preact';
import { route } from 'preact-router';

export default class Fight extends Component {
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
		
	}

	render() {
		return (
			<div class={'scene ' + (!this.state.started? ' scene--not-started' : '')}>
				<div class="scene__bg scene__bg--2"></div>
				<div class="scene__bg scene__bg--3"></div>
				<div class="scene__bg scene__bg--4"></div>
				<div class="scene__bg scene__bg--5"></div>
				<div class="scene__people scene__people--fight">
					<div class="scene__person scene__person--brute"></div>
					<div class="scene__person scene__person--fighter"></div>
				</div>
			</div>
		);
	}
};
