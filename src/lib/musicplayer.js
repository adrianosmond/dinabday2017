export default class MusicPlayer {
	constructor (path, loop = true) {
		this.music = new Audio(path);
		this.music.loop = loop;
		this.music.volume = 1;
		this.music.play();
	}

	stop () {
		this.music.pause();
	}
	
	fadeOut (duration) {
		const start = new Date().getTime();
		let interval = setInterval(() => {
			let now = new Date().getTime();
			let pct = (now - start) / duration;
			this.music.volume = Math.max(1 - pct, 0);
			if (now > start + duration) {
				clearInterval(interval);
			}
		}, 100)
	}
};
