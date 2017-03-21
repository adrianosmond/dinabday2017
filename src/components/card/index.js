import { h, Component } from 'preact';
import { route } from 'preact-router';

export default class Card extends Component {
	state = {
		loaded: false
	}

	componentWillMount() {
		this.setState({
			loaded: true
		});
	}

	render() {
		return (
			<div class={'parchment' + (this.state.loaded ? ' parchment--loaded' : '')}>
				<div class="parchment__parchment-image parchment__parchment-image--endGame"></div>
			</div>
		);
	}
};
