import { h, Component } from 'preact';
import Compass from '../compass';
// import style from './style';

export default class Map extends Component {
	state = {
		map: {
			rows: []
		},
		currentX: 12,
		currentY: 1
	}

	componentWillMount() {
		var ref = firebase.database().ref("map").on("value", (result) => {
			this.setState({map: result.val()});
		});
	}

	cellClick(rowIdx, colIdx) {
		this.setState({
			currentY: rowIdx,
			currentX: colIdx
		});
	}

	cellOpacity(rowIdx, colIdx) {
		var str = "opacity: ";
		if (rowIdx === this.state.currentY && colIdx === this.state.currentX) {
			str += 1;
		} else if ((rowIdx === this.state.currentY || rowIdx + 1 === this.state.currentY || rowIdx - 1 === this.state.currentY) &&
					(colIdx === this.state.currentX || colIdx + 1 === this.state.currentX || colIdx - 1 === this.state.currentX)) {
			str += 0.5;
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
										style={this.cellOpacity(rowIdx, colIdx)}
										onClick={this.cellClick.bind(this, rowIdx, colIdx)}></div>
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