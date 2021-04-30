import { fps25, TCFramerate, TCtime } from './types';

const msPerS = 1000;
const msPerMin = msPerS * 60;
const msPerHour = msPerMin * 60;

//index 2 isnt 29.97 because that rate actually counts to 30 frames most of the time
const TimecodeFramerates = [24, 25, 30, 30];

export class MTCTime {
	/*
    Rate:
        0: 24 fps
        1: 25 fps
        2: 29.97 fps
        3: 30 fps
    */
	rate: TCFramerate;
	time: MTCClockTime;
	str: string;

	offset: TCtime;

	constructor(time?: TCtime, rate?: TCFramerate, offset?: TCtime) {
		this.time = new MTCClockTime(time ? time : { h: 0, m: 0, s: 0, f: 0 });
		this.rate = rate ? rate : fps25;
		this.str = this.time.toString();

		this.offset = offset ? offset : { h: 0, m: 0, s: 0, f: 0 };
	}

	advanceFrame = () => {
		this.time.advanceFrame(this.rate);
		this.str = this.time.toString();
	};

	getRate = (): TCFramerate => this.rate;
	getTime = (): MTCClockTime => this.time;

	setTimeFromMsOffset(time: number) {
		const h = Math.floor(time / msPerHour) + this.offset.h;
		time %= msPerHour;
		const m = Math.floor(time / msPerMin) + this.offset.m;
		time %= msPerMin;
		const s = Math.floor(time / msPerS) + this.offset.s;
		time %= msPerS;
		// console.log("time: ", time)
		// console.log("fr: ", TimecodeFramerates[this.rate])
		const f =
			Math.floor((time * TimecodeFramerates[this.rate]) / 1000) +
			this.offset.f;

		this.time.setTime({ h, m, s, f });

		this.str = this.time.toString();
	}

	toString() {
		return this.time.toString();
	}

	setOffset(time: TCtime) {
		this.offset = time;
	}

	getCurrentFrame(): TCtime {
		const { h, m, s, f } = this.time;
		return { h, m, s, f };
	}

	getNextFrame(frame: TCtime): TCtime {
		let { h, m, s, f } = frame;

		f += 1;
		if (f === TimecodeFramerates[this.rate]) {
			f = 0;
			s += 1;
		}
		if (s === 60) {
			s = 0;
			m += 1;
		}
		if (m === 60) {
			m = 0;
			h += 1;
		}
		if (h === 24) {
			h = 0;
		}
		return { h, m, s, f };
	}
}

export class MTCClockTime {
	h: number;
	m: number;
	s: number;
	f: number;

	constructor(time?: TCtime) {
		if (time) {
			this.h = time.h;
			this.m = time.m;
			this.s = time.s;
			this.f = time.f;
		} else {
			this.h = 0;
			this.m = 0;
			this.s = 0;
			this.f = 0;
		}
	}

	toString = () => {
		return `${this.pad(this.h, 2)}:${this.pad(this.m, 2)}:${this.pad(
			this.s,
			2
		)}:${this.pad(this.f, 2)}`;
	};

	pad = (num: number, size: number) => {
		var s = num + '';
		while (s.length < size) s = '0' + s;
		return s;
	};

	advanceFrame = (framerate: number) => {
		this.f += 1;
		if (this.f === TimecodeFramerates[framerate]) {
			this.s += 1;
			this.f = 0;
		}
		if (this.s === 60) {
			this.m += 1;
			this.s = 0;
		}
		if (this.m === 60) {
			this.h += 1;
			this.m = 0;
		}
		if (this.h === 24) {
			this.h = 0;
		}
	};

	setTime = (time: TCtime) => {
		const { h, m, s, f } = time;
		if (this.h !== h || this.m !== m || this.s !== s || this.f !== f) {
			// console.log('setting new time: ',h,m,s,f, '\t',
			// 'current time: ', this.h, this.m, this.s, this.f, '\t',
			// 'difference: ', this.h-h, this.m-m, this.s-s, this.f-f)
			this.h = h;
			this.m = m;
			this.s = s;
			this.f = f;
		}
	};

	frameDifference = (a: TCtime, b: TCtime) => {};
}
