import { h, Component } from 'preact';
import { route } from 'preact-router';
import MusicPlayer from 'musicplayer.js';

export default class Fight extends Component {
	state = {
		decided: true,
		started: false,
		fighterDistance: 0,
		brutePunched: false,
		bruteLookBack: false,
		won: false
	}

	componentWillMount() {
		this.boundKeyListener = this.keylistener.bind(this)
		this.boundAnimationListener = this.animationListener.bind(this);

		document.addEventListener("keyup", this.boundKeyListener);
		document.addEventListener("animationiteration", this.boundAnimationListener);

		setTimeout(() => {
			this.setState({
				started: true
			});
		}, 200);

		this.fighterInterval = setInterval(this.updateFightState.bind(this), 250);
		this.music = new MusicPlayer("/assets/audio/fight.mp3");
	}

	componentWillUnmount() {
		this.music.stop();
		document.removeEventListener("keyup", this.boundKeyListener);
		document.removeEventListener("animationiteration", this.boundAnimationListener);
	}

	animationListener(e) {
		if (this.state.fighterDistance >= 420) {
			this.setState({
				won: true
			});
			firebase.database().ref("conversations/currentState").set("wonFight");
		}
	}

	inputKeyListener(e) {
		if (!this.state.brutePunched && !this.moreShoutsBlocked) {
			if (e.keyCode === 13) {
				let val = e.target.value.trim().toLowerCase();
				if (val === "patsy") {
					this.turnBrute(5000);
				} else if (val.length > 0) {
					this.turnBrute(500);
					this.moreShoutsBlocked = true;
					setTimeout(() => {
						this.moreShoutsBlocked = false;
					}, 1000);
				}
				e.target.value = "";
			}
		}
	}

	keylistener(e) {
		if (this.state.decided === false) {
			if (e.keyCode === 49) {
				this.setState({
					decided: true,
					started: false,
					fighterDistance: 0,
					brutePunched: false,
					bruteLookBack: false,
					won: false
				});

				setTimeout(() => {
					this.setState({
						started: true
					});
					this.fighterInterval = setInterval(this.updateFightState.bind(this), 250);
				}, 25);
			} else if (e.keyCode === 50) {
				this.leaveFight()
			}
		}
	}

	leaveFight() {
		this.setState({
			decided: true,
			started: false
		});

		this.music.fadeOut(2000);

		setTimeout(() => {
			if (this.state.won) {
				route("/conversation/fighter/");
			} else {
				route("/map/");
			}
		}, 2200);
	}

	turnBrute(duration) {
		this.setState({
			bruteLookBack: true
		});

		setTimeout(() => {
			this.setState({
				bruteLookBack: false
			});
		}, duration);
	}

	updateFightState() {
		let newDistance = this.state.fighterDistance

		if (this.state.won) {
			newDistance -= 20;
		} else {
			newDistance += 10;
		}

		this.setState({
			fighterDistance: newDistance
		});

		if (newDistance > 300) {
			if (!this.state.bruteLookBack) {
				this.setState({
					brutePunched: true
				});
				clearInterval(this.fighterInterval);
				if (this.state.won) {
					setTimeout(this.leaveFight.bind(this), 1000);
				} else {
					setTimeout(() => {
						this.setState({
							decided: false
						});
					}, 1000);
				}
			}
		} else if (newDistance <= 100) {
			if (this.state.won) {
				clearInterval(this.fighterInterval);
				this.leaveFight();
			}
		}
	}

	fighterTransform() {
		if (this.state.brutePunched) {
			return "transform: translateX(50vw) translateY(-100vh) rotate(90deg)";
		}
		return "transform: translateX(-" + this.state.fighterDistance + "px);";
	}

	render() {
		return (
			<div class={'scene ' + (!this.state.started? ' scene--not-started' : '')}>
				<div class="scene__bg scene__bg--2"></div>
				<div class="scene__bg scene__bg--3"></div>
				<div class="scene__bg scene__bg--4"></div>
				<div class="scene__bg scene__bg--5"></div>
				<div class="scene__instruction">
					<label>Shout out: <input type="text" id="shout-out" class="pixel-input" disabled={!this.state.decided} onKeyPress={this.inputKeyListener.bind(this)}/></label>
				</div>
				<div class="scene__people scene__people--wide">
					<div class={'scene__person scene__person--brute'
						+ (this.state.brutePunched? ' scene__person--brute-punching' : '')
						+ (this.state.bruteLookBack ? ' scene__person--brute-look-back' : '')}></div>
					<div class={'scene__person scene__person--fighter' 
						+ (this.state.won ? ' scene__person--fighter-won' : '')} style={this.fighterTransform()}></div>
				</div>
				<div class={'scene__decision' + (this.state.decided ? ' scene__decision--done': '')}>
					<p class="scene__decision-question">Fight again?</p>
					<ul class="scene__decision-options">
						<li class="scene__decision-option">1: We can take him...</li>
						<li class="scene__decision-option">2: No. Please no more!</li>
					</ul>
				</div>
			</div>
		);
	}
};
