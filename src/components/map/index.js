import { h, Component } from 'preact';
import Compass from '../compass';

export default class Map extends Component {
	state = {
		map: {
			rows: []
		},
		currentX: 12,
		currentY: 1
	};


	componentWillMount() {
		var ref = firebase.database().ref("map").on("value", (result) => {
			this.setState({map: result.val()});
		});

		window.addEventListener("move-player", this.moveMap.bind(this));
	}

	componentWillUnmount() {
		window.removeEventListener("move-player", this.moveMap);
	}


	moveMap(e) {
		let direction = e.detail;

		if (direction === "north" && this.canGoNorth()) {
			this.setState({
				currentY: this.state.currentY - 1
			});
		} else if (direction === "south" && this.canGoSouth()) {
			this.setState({
				currentY: this.state.currentY + 1
			});
		} else if (direction === "east" && this.canGoEast()) {
			this.setState({
				currentX: this.state.currentX + 1
			});
		} else if (direction === "west" && this.canGoWest()) {
			this.setState({
				currentX: this.state.currentX - 1
			});
		}
	}

	neighbouring(potentialNeighbour, current) {
		return potentialNeighbour === current
				|| potentialNeighbour + 1 === current
				|| potentialNeighbour - 1 === current;
	}

	cellOpacity(rowIdx, colIdx) {
		var str = "opacity: ";
		if (rowIdx === this.state.currentY && colIdx === this.state.currentX) {
			str += 1;
		} else if (this.neighbouring(rowIdx, this.state.currentY) && this.neighbouring(colIdx, this.state.currentX)) {
			str += 0.4;
		} else {
			str += 0;
		}
		str += ";";
		return str;
	}

	mapTransform() {
		var xTransform = ((12 - this.state.currentX) * 30) + "px";
		var yTransform = ((12 - this.state.currentY) * 30) + "px";

		return "transform: rotateX(55deg) scale(3) translateX(" + xTransform + ") translateY(" + yTransform + ");"
	}

	canGoNorth() {
		if (this.state.map.rows.length === 0) return false;
		return this.state.map.rows[this.state.currentY - 1].cols[this.state.currentX].height > 0;
	}

	canGoSouth() {
		if (this.state.map.rows.length === 0) return false;
		return this.state.map.rows[this.state.currentY + 1].cols[this.state.currentX].height > 0;
	}

	canGoEast() {
		if (this.state.map.rows.length === 0) return false;
		return this.state.map.rows[this.state.currentY].cols[this.state.currentX + 1].height > 0;
	}

	canGoWest() {
		if (this.state.map.rows.length === 0) return false;
		return this.state.map.rows[this.state.currentY].cols[this.state.currentX - 1].height > 0;
	}

	render() {
		return (
			<div class="map">
				<Compass north={this.canGoNorth()} 
					south={this.canGoSouth()}
					east={this.canGoEast()}
					west={this.canGoWest()} />
				<div class="map__inner" style={this.mapTransform()}>
					{this.state.map.rows.map((row, rowIdx) => {
						return (
							<div class="map__row">
							{row.cols.map((cell, colIdx) => {
								return (
									<div class={'map__cell map__cell--height-' + cell.height}
										style={this.cellOpacity(rowIdx, colIdx)}></div>
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