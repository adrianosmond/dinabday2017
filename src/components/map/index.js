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
		function makeTree(rowIdx, colIdx) {
			firebase.database().ref("map/rows/" + rowIdx + "/cols/" + colIdx + "/trees").set(true);
		}
		makeTree(5, 13)
		makeTree(6, 13)
		makeTree(7, 13)
		makeTree(7, 14)
		makeTree(8, 13)
		makeTree(8, 14)
		makeTree(9, 13)
		makeTree(9, 14)
		makeTree(9, 15)
		makeTree(10, 14)
		makeTree(10, 15)
		makeTree(11, 14)
		makeTree(12, 14)
		makeTree(12, 15)
		makeTree(13, 14)
		makeTree(22, 7)
		makeTree(23, 4)
		makeTree(23, 5)
		makeTree(23, 6)
		makeTree(23, 7)
		makeTree(24, 5)
		makeTree(24, 6)
		makeTree(5, 13)
		makeTree(6, 13)
		makeTree(7, 13)
		makeTree(7, 14)
		makeTree(8, 13)
		makeTree(8, 14)
		makeTree(9, 13)
		makeTree(9, 14)
		makeTree(9, 15)
		makeTree(10, 14)
		makeTree(10, 15)
		makeTree(11, 14)
		makeTree(12, 14)
		makeTree(12, 15)
		makeTree(13, 14)
		makeTree(22, 7)
		makeTree(23, 4)
		makeTree(23, 5)
		makeTree(23, 6)
		makeTree(23, 7)
		makeTree(24, 5)
		makeTree(24, 6)


		this.walkingTimeout = null;
		let ref = firebase.database().ref("map").on("value", (result) => {
			let map = result.val();
			let hideFog = map.inventory && map.inventory.map;
			let haveBoots = map.inventory && map.inventory.boots;
			this.setState({
				map: map,
				knowAboutMountains: window.sessionStorage.getItem("seen-a-mountain") === "true",
				hideFog: hideFog,
				haveBoots: haveBoots
			});

			setTimeout(() => {
				this.setState({
					loading: false
				});
			}, 100)
		});

		this.boundKeyListener = this.keylistener.bind(this);

		document.addEventListener("keyup", this.boundKeyListener);
	}

	componentWillUnmount() {
		firebase.database().ref("map").set(this.state.map);
		document.removeEventListener("keyup", this.boundKeyListener);
	}

	keylistener(e) {
		if (blockKeys || this.state.map.rows.length === 0 || this.state.loading) return;

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

				this.setState({
					loading: true
				});

				let conversationURL = "/conversation/" + character + "/";
				if (character === "envelope") {
					conversationURL = "/card/";
				}
				
				setTimeout(() => {
					route(conversationURL);
				}, 1000);
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

			if (this.walkingTimeout) {
				clearTimeout(this.walkingTimeout);
			}

			this.walkingTimeout = setTimeout(() => {
				this.setState({
					moving: false
				});
			}, 750);
		}
	}

	neighbouring(potentialNeighbour, current, haveMap) {
		if (haveMap) {
			return potentialNeighbour === current
					|| potentialNeighbour + 1 === current
					|| potentialNeighbour - 1 === current;
		} else {
			return potentialNeighbour === current
					|| potentialNeighbour + 1 === current
					|| potentialNeighbour - 1 === current
					|| potentialNeighbour + 2 === current
					|| potentialNeighbour - 2 === current;
		}
	}

	cellVisible(rowIdx, colIdx, haveMap) {
		let visibleThroughProximity = this.neighbouring(rowIdx, this.state.map.currentPosition.y, haveMap) &&
			this.neighbouring(colIdx, this.state.map.currentPosition.x, haveMap);

		let seenPreviously = false;

		if (haveMap) {

			seenPreviously = this.state.map.rows[rowIdx].cols[colIdx].seen;


			if (visibleThroughProximity) {
				if (!seenPreviously) {
					let newMap = JSON.parse(JSON.stringify(this.state.map));
					newMap.rows[rowIdx].cols[colIdx].seen = true;

					this.setState({
						map: newMap
					});
				}
			}
		}

		return visibleThroughProximity || seenPreviously;
	}

	character(id) {
		return (
			<div class={'map__character character character--' + id}></div>
		);
	}

	// cellClick(rowIdx, colIdx, cell) {
	// 	firebase.database().ref("map/rows/" + rowIdx + "/cols/" + colIdx + "/trees").set(!cell.trees);
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
		if (height===3) {
			if (this.state.haveBoots) {
				return true;
			} else if (!this.state.knowAboutMountains) {
				this.setState({
					loading: true
				});

				setTimeout(() => {
					route("/mountain/");
				}, 1000);
			}
		} 
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

	trees() {
		return (
			<div class="map__trees"></div>
		);
	}

	render() {
		return (
			<div class={'map' + (this.state.loading? ' map--loading' : '') + (this.state.hideFog? ' map--remember' : '')}>
				<div class="map__fog"></div>
				<div class={"map__avatar" + (this.state.moving? ' map__avatar--walking' : '') + (' map__avatar--height-' + this.cellHeight())}></div>
				<div class="map__inner" style={this.mapTransform()}>
					{this.state.map.rows.map((row, rowIdx) => {
						return (
							<div class="map__row">
							{row.cols.map((cell, colIdx) => {
								let vis = this.cellVisible(rowIdx, colIdx, this.state.hideFog);

								return (
									<div class={'map__cell map__cell--height-' + cell.height + (!vis ? ' map__cell--hidden': '') + (cell.trees ? ' map__cell--trees' : '')}>
										{(vis && cell.character ? this.character(cell.character) : '')}
										{(cell.trees ? this.trees() : '')}
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
