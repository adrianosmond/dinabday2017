import { h, Component } from 'preact';
import Compass from '../compass';

export default class Map extends Component {
	state = {
		map: {
			rows: []
		},
		currentX: 11,
		currentY: 2,
		moving: false
	};


	componentWillMount() {
		var ref = firebase.database().ref("map").once("value", (result) => {
			this.setState({map: result.val()});
		});

		window.addEventListener("move-player", this.moveMap.bind(this));
	}

	componentWillUnmount() {
		window.removeEventListener("move-player", this.moveMap);
	}


	moveMap(e) {
		let direction = e.detail;
		let moved = false;

		if (direction === "north" && this.canGoNorth()) {
			moved = true;
			this.setState({
				currentY: this.state.currentY - 1
			});
		} else if (direction === "south" && this.canGoSouth()) {
			moved = true;
			this.setState({
				currentY: this.state.currentY + 1
			});
		} else if (direction === "east" && this.canGoEast()) {
			moved = true;
			this.setState({
				currentX: this.state.currentX + 1
			});
		} else if (direction === "west" && this.canGoWest()) {
			moved = true;
			this.setState({
				currentX: this.state.currentX - 1
			});
		}

		if (moved) {
			this.setState({
				moving: true
			});

			setTimeout(() => {
				this.setState({
					moving: false
				});				
			}, 500);
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
		return this.neighbouring(rowIdx, this.state.currentY) && 
			this.neighbouring(colIdx, this.state.currentX);
	}

	// cellClick(rowIdx, colIdx, cell) {
	// 	var newHeight = (cell.height + 1) % 4;
	// 	firebase.database().ref("map/rows/" + rowIdx + "/cols/" + colIdx + "/height").set(newHeight);
	// }

	mapTransform() {
		var xTransform = ((10.5 - this.state.currentX) * 30) + "px";
		var yTransform = ((13 - this.state.currentY) * 30) + "px";

		return "transform: rotateX(55deg) scale(3) translateX(" + xTransform + ") translateY(" + yTransform + ");"
	}

	terrainPassable(height) {
		return height > 0 && height < 3;
	}

	canGoNorth() {
		if (this.state.map.rows.length === 0) return false;
		return this.terrainPassable(this.state.map.rows[this.state.currentY - 1].cols[this.state.currentX].height);
	}

	canGoSouth() {
		if (this.state.map.rows.length === 0) return false;
		return this.terrainPassable(this.state.map.rows[this.state.currentY + 1].cols[this.state.currentX].height);
	}

	canGoEast() {
		if (this.state.map.rows.length === 0) return false;
		return this.terrainPassable(this.state.map.rows[this.state.currentY].cols[this.state.currentX + 1].height);
	}

	canGoWest() {
		if (this.state.map.rows.length === 0) return false;
		return this.terrainPassable(this.state.map.rows[this.state.currentY].cols[this.state.currentX - 1].height);
	}

	render() {
		return (
			<div class="map">
				<Compass north={this.canGoNorth()} 
					south={this.canGoSouth()}
					east={this.canGoEast()}
					west={this.canGoWest()} />
				<div class="map__fog"></div>
				<div class={"map__avatar" + (this.state.moving? ' map__avatar--walking' : '')}></div>
				<div class="map__inner" style={this.mapTransform()}>
					{this.state.map.rows.map((row, rowIdx) => {
						return (
							<div class="map__row">
							{row.cols.map((cell, colIdx) => {
								return (
									<div class={'map__cell map__cell--height-' + cell.height + (!this.cellVisible(rowIdx, colIdx) ? ' map__cell--hidden': '') }></div>
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