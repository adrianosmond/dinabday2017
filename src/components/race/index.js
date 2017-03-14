import { h, Component } from 'preact';
import { route } from 'preact-router';

export default class Race extends Component {
	state = {
		started: false
	}

	componentWillMount() {
		this.boundKeyListener = this.keylistener.bind(this);
		document.addEventListener("keyup", this.boundKeyListener);

		setTimeout(() => {
			this.setState({
				started: true,
				power: 0,
				difference: 0,
				timer: 30,
				chocolate: false
			});
		}, 200);

		this.raceInterval = setInterval(this.updateRaceState.bind(this), 100);
		this.timerInterval = setInterval(this.updateTimerState.bind(this), 1000);
		this.lastTime = new Date().getTime();
		requestAnimationFrame(this.updateBar.bind(this));
	}

	componentWillUnmount() {
		document.removeEventListener("keyup", this.boundKeyListener);
		clearInterval(this.raceInterval);
		clearInterval(this.timerInterval);
	}

	endRace() {
		clearInterval(this.raceInterval);
		clearInterval(this.timerInterval);

		this.setState({
			started: false
		});

		setTimeout(() => {
			route("/map/");
		}, 2000);
	}

	keylistener(e) {
		let powerPerKeypress = 10;
		if (this.state.chocolate) {
			powerPerKeypress = 25
		}

		if (e.keyCode === 32) {
			this.setState({
				power: Math.min(100, this.state.power + powerPerKeypress)
			});
		}
	}

	updateBar() {
		let now = new Date().getTime();
		let diff = now - this.lastTime;

		let newPower = Math.max(0, this.state.power - (diff / 16));

		this.setState({
			power: newPower
		});

		this.lastTime = now;
		requestAnimationFrame(this.updateBar.bind(this));
	}

	updateRaceState() {
		let power = this.state.power;
		let newDifference = this.state.difference;
		let newBehind = this.state.behind;

		let threshold = 100 - Math.min(5, this.state.timer);

		if (this.state.chocolate) {
			threshold = 80;
		}

		if (power > threshold) {
			newDifference += Math.max(5, 100 - power);
		} else {
			newDifference -= Math.min(5, threshold - power);
		}

		if (Math.abs(newDifference) > 500) {
			this.endRace();
		}

		this.setState({
			difference: newDifference
		});
	}

	updateTimerState() {

		let newTime = this.state.timer-1;

		this.setState({
			timer: newTime
		});

		if (newTime <= 0) {
			this.endRace();
		}
	}

	raceBar() {
		return (
			<div class="race-bar">
				<p class="race-bar__caption">SPEED:</p>
				<div class="race-bar__bar">
					<div class="race-bar__inner" style={'width: ' + this.state.power + '%'}></div>
				</div>
			</div>
		)
	}

	render() {
		return (
			<div class={'scene ' + (!this.state.started? ' scene--dark' : '')}>
				<div class="scene__bg scene__bg--parallax scene__bg--2"></div>
				<div class="scene__bg scene__bg--parallax scene__bg--3"></div>
				<div class="scene__bg scene__bg--parallax scene__bg--4"></div>
				<div class="scene__bg scene__bg--parallax scene__bg--5"></div>

				<div class="scene__race-bar-wrapper">
					{this.raceBar()}
				</div>

				<div class="scene__race-timer">{this.state.timer}</div>

				<div class="scene__people scene__people--race">
					<div class="scene__person-wrapper scene__person-wrapper--running">
						<div style={'transform: translateX(' + (-1 * this.state.difference) + 'px); transition: transform 0.1s;'}>
							<div class="scene__person scene__person--levendig"></div>
						</div>
					</div>
					<div class="scene__person-wrapper scene__person-wrapper--running">
						<div style={'transform: translateX(' + this.state.difference + 'px); transition: transform 0.1s;'}>
							<div class={'scene__person scene__person--dina' + (this.state.chocolate? '-with-chocolate' : '')}></div>
						</div>
					</div>
				</div>
			</div>
		);
	}
};
