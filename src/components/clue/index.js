import { h, Component } from 'preact';
import { route } from 'preact-router';

export default class Clue extends Component {
	state = {
		loaded: false
	}

	componentWillMount() {
		this.boundInputKeyListener = this.inputKeyListener.bind(this)

		firebase.database().ref("conversations/currentState").once("value", (result) => {
			this.setState({
				loaded: true,
				clueFor: result.val()
			});
		});
	}

	componentDidMount() {
		document.getElementById("clue-input").addEventListener("keyup", this.boundInputKeyListener);
	}

	componentDidUnount() {
		document.getElementById("clue-input").addEventListener("keyup", this.boundInputKeyListener);
	}

	leaveClue() {
		setTimeout(() => {
			this.setState({
				loaded: false
			});

			setTimeout(() => {
				route("/map");
			}, 1000);
		}, 500);
	}

	inputKeyListener(e) {

		if (e.keyCode === 13) {
			let val = e.target.value.trim().toLowerCase();
			if (this.state.clueFor === "wonFight" && val === "4f8af0bd") {
				firebase.database().ref("conversations/currentState").set("haveMap");
				firebase.database().ref("map/inventory/map").set(true);
				this.leaveClue();
			} else {
				e.target.value = "";
			}
		}
	}

	render() {
		return (
			<div class={'clue' + (this.state.loaded ? ' clue--loaded' : '')}>
				<div class={'clue__clue-image' + (this.state.clueFor? ' clue__clue-image--' + this.state.clueFor : '')}></div>
				<div class="clue__input-wrapper">
					<p>Enter code when found:</p>
					<input type="text" id="clue-input" class="pixel-input" />
				</div>
			</div>
		);
	}
};
