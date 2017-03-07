import { h, Component } from 'preact';
import { route } from 'preact-router';

let blockKeys = false;

export default class Map extends Component {
	state = {
		loading: true,
		map: {
			rows: []
		},
		moving: false
	};

	componentWillMount() {
		let ref = firebase.database().ref("map").once("value", (result) => {
			this.setState({
				map: result.val(),
			});

			setTimeout(() => {
				this.setState({
					map: result.val(),
					loading: false
				});
			}, 100)
		});

		this.boundKeyListener = this.keylistener.bind(this);

		document.addEventListener("keyup", this.boundKeyListener);
	}

	componentWillUnmount() {
		firebase.database().ref("map/currentPosition").set(this.state.map.currentPosition);
		document.removeEventListener("keyup", this.boundKeyListener);
	}

	keylistener(e) {
		if (blockKeys || this.state.map.rows.length === 0) return;

		let moved = false;
		let code = e.keyCode;
		let newMap;

		if (code === 38 && this.canGoNorth()) {
			moved = true;
			newMap = JSON.parse(JSON.stringify(this.state.map));
			newMap.currentPosition.y -= 1
		} else if (code === 40 && this.canGoSouth()) {
			moved = true;
			newMap = JSON.parse(JSON.stringify(this.state.map));
			newMap.currentPosition.y += 1
		} else if (code === 39 && this.canGoEast()) {
			moved = true;
			newMap = JSON.parse(JSON.stringify(this.state.map));
			newMap.currentPosition.x += 1
		} else if (code === 37 && this.canGoWest()) {
			moved = true;
			newMap = JSON.parse(JSON.stringify(this.state.map));
			newMap.currentPosition.x -= 1
		} else if (code === 32) {
			let character = this.state.map.rows[this.state.map.currentPosition.y].cols[this.state.map.currentPosition.x].character;
			if (character) {
				let conversationURL = "/conversation/" + character + "/";
				route(conversationURL);
			}
		}

		if (moved) {
			blockKeys = true;
			this.setState({
				map: newMap,
				moving: true
			});

			setTimeout(() => {
				blockKeys = false;
			}, 350);

			setTimeout(() => {
				this.setState({
					moving: false
				});
			}, 750);
		}
	}

	neighbouring(potentialNeighbour, current) {
		return potentialNeighbour === current
				|| potentialNeighbour + 1 === current
				|| potentialNeighbour - 1 === current
				|| potentialNeighbour + 2 === current
				|| potentialNeighbour - 2 === current;
	}

	cellVisible(rowIdx, colIdx) {
		return this.neighbouring(rowIdx, this.state.map.currentPosition.y) &&
			this.neighbouring(colIdx, this.state.map.currentPosition.x);
	}

	character(id) {
		return (
			<div class={'map__character character character--' + id}></div>
		);
	}

	// cellClick(rowIdx, colIdx, cell) {
	// 	let newHeight = (cell.height + 1) % 4;
	// 	firebase.database().ref("map/rows/" + rowIdx + "/cols/" + colIdx + "/height").set(newHeight);
	// }

	cellHeight() {
		if (this.state.map.rows.length === 0) return 0;
		return this.state.map.rows[this.state.map.currentPosition.y].cols[this.state.map.currentPosition.x].height;
	}

	mapTransform() {
		if (this.state.map.rows.length === 0) return "transform: rotateX(55deg) scale(3); transition-duration: 0s;";

		let xTransform = ((10.5 - this.state.map.currentPosition.x) * 30) + "px";
		let yTransform = ((13 - this.state.map.currentPosition.y) * 30) + "px";

		return "transform: rotateX(55deg) scale(3) translateX(" + xTransform + ") translateY(" + yTransform + ");"
	}

	terrainPassable(height) {
		return height > 0 && height < 3;
	}

	canGoNorth() {
		if (this.state.map.rows.length === 0) return false;
		return this.terrainPassable(this.state.map.rows[this.state.map.currentPosition.y - 1].cols[this.state.map.currentPosition.x].height);
	}

	canGoSouth() {
		if (this.state.map.rows.length === 0) return false;
		return this.terrainPassable(this.state.map.rows[this.state.map.currentPosition.y + 1].cols[this.state.map.currentPosition.x].height);
	}

	canGoEast() {
		if (this.state.map.rows.length === 0) return false;
		return this.terrainPassable(this.state.map.rows[this.state.map.currentPosition.y].cols[this.state.map.currentPosition.x + 1].height);
	}

	canGoWest() {
		if (this.state.map.rows.length === 0) return false;
		return this.terrainPassable(this.state.map.rows[this.state.map.currentPosition.y].cols[this.state.map.currentPosition.x - 1].height);
	}

	render() {
		return (
			<div class={'map' + (this.state.loading? ' map--loading' : '')}>
				<div class="map__fog"></div>
				<div class={"map__avatar" + (this.state.moving? ' map__avatar--walking' : '') + (' map__avatar--height-' + this.cellHeight())}></div>
				<div class="map__inner" style={this.mapTransform()}>
					{this.state.map.rows.map((row, rowIdx) => {
						return (
							<div class="map__row">
							{row.cols.map((cell, colIdx) => {
								return (
									<div class={'map__cell map__cell--height-' + cell.height + (!this.cellVisible(rowIdx, colIdx) ? ' map__cell--hidden': '') }>
										{(this.cellVisible(rowIdx, colIdx) && cell.character ? this.character(cell.character) : '')}
									</div>
								);
							})}
							</div>
						);
					})}
				</div>
			</div>
		);
	}
}
