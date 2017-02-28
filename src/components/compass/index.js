import { h, Component } from 'preact';

export default class Compass extends Component {
	
	state = {
		directions: [
			"north",
			"south",
			"east",
			"west"
		]
	};

	move(direction) {
		console.log(direction);
	}

	render() {
		return (
			<div class="map__compass">
				{this.state.directions.map(d => {
					return (
						<button class={'map__compass-button map__compass-button--' + d} 
								disabled={!this.props[d]}
								onClick={this.move.bind(this, d)}>{d.substring(0,1)}</button>
					);
				})}
				<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 300 300">
					<path d="M52 150l75.8 22.89L150 248l22.86-75.163L248 150l-75.14-22.224L150 52l-22.2 75.776z" fill="none" stroke-width="3" stroke="#ffffff" />
					<path d="M52 150h98l-22.2 22.89zm98 0h98l-75.298-22.172zm0 0v98l22.702-75.11zm0 0V52l-22.2 75.828zm-11.802 74.638c-32.25-5.164-57.7-30.617-62.865-62.865l5.567 1.68c5.528 27.994 27.624 50.09 55.617 55.618l1.68 5.57zm24.21 0l1.68-5.62c27.975-5.547 50.086-27.59 55.62-55.564l5.566-1.68c-5.17 32.23-30.634 57.68-62.865 62.864zm-87.075-87.13c5.2-32.206 30.65-57.645 62.865-62.81l-1.68 5.618c-27.953 5.533-50.002 27.566-55.566 55.513l-5.62 1.68zm149.94 0l-5.62-1.68c-5.564-27.912-27.6-49.946-55.51-55.512l-1.682-5.62c32.176 5.205 57.61 30.64 62.816 62.813z" fill="#ffffff"/>
				</svg>
			</div>
		);
	}
}