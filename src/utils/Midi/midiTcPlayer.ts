import { Subject } from 'rxjs';
import webmidi from 'webmidi';
import { Input, Output } from 'webmidi';
import { fps25, fps30, TCFramerate, TCtime, TCZeroTime } from './types';

const msPerS = 1000;
const msPerMin = msPerS * 60;
const msPerHour = msPerMin * 60;

export const TCSpeeds = [24, 25, 29.97, 30];

export const timeToString = (t: TCtime) => {
	return `${strPad(t.h, 2)}:${strPad(t.m, 2)}:${strPad(t.s, 2)}:${strPad(
		t.f,
		2
	)}`;
};

const strPad = (n: number, l: number) => {
	let s = n + '';
	while (s.length < l) s = '0' + s;
	return s;
};

class MidiTcPlayer {
	_time: TCtime;
	_quarterFrameCounter = 0;
	_frameCounter = 0;
	offset: TCtime;
	framerate: TCFramerate;

	_playerStart = 0;

	activeInput?: number;
	activeOutput?: number;

	inputSub = new Subject<Input[]>();
	outputSub = new Subject<Output[]>();
	timeSub = new Subject<TCtime>();

	inputs$ = this.inputSub.asObservable();
	outputs$ = this.outputSub.asObservable();
	time$ = this.timeSub.asObservable();

	isPlaying: boolean;
	playerTimeout?: NodeJS.Timeout;

	constructor() {
		this._time = TCZeroTime;
		this.offset = TCZeroTime;
		this.framerate = fps30;

		this.isPlaying = false;

		webmidi.enable((err) => {
			if (err) {
				throw new Error(
					'Could not initialize Midi. Ensure your browser supports Midi connections'
				);
			}

			this.inputSub.next(webmidi.inputs);
			this.outputSub.next(webmidi.outputs);
			this.activeInput = webmidi.inputs[0] ? 0 : undefined;
			this.activeOutput = webmidi.outputs[0] ? 0 : undefined;
			this.connectListen();
		}, true);
	}

	setInput(i: number) {
		if (i < webmidi.inputs.length) {
			this.activeInput = i;
		} else {
			throw new Error('Invalid input selection');
		}
	}

	setOutput(i: number) {
		if (i < webmidi.outputs.length) {
			this.activeOutput = i;
		} else {
			throw new Error('Invalid output selection');
		}
	}

	setOffset(t: TCtime) {
		this.offset = t;
	}

	connectListen() {
		webmidi.addListener('connected', (e) => {
			this.inputSub.next(webmidi.inputs);
			this.outputSub.next(webmidi.outputs);
			console.log('New Midi Device Connected');
		});

		webmidi.addListener('disconnected', (e) => {
			this.inputSub.next(webmidi.inputs);
			this.outputSub.next(webmidi.outputs);
			if (this.activeInput && this.activeInput > webmidi.inputs.length) {
				this.activeInput = webmidi.inputs.length;
			}
			if (
				this.activeOutput &&
				this.activeOutput > webmidi.outputs.length
			) {
				this.activeOutput = webmidi.outputs.length;
			}
			console.log('Midi Device Disconnected');
		});
	}

	play() {
		if (this.isPlaying) {
			console.error('There is already a TC slot playing');
			throw new Error('There is already a TC slot playing');
		} else if (!this.activeOutput) {
			throw new Error('There is no active Midi output');
		}

		this.isPlaying = true;
		//send midi TC start code.
		let hourbyte = (this._time.h + (this.framerate << 1)) & 0x06;
		webmidi.outputs[this.activeOutput].send(0xf0, [
			0x7f,
			0x7f,
			0x01,
			0x01,
			hourbyte,
			this._time.m,
			this._time.s,
			this._time.f,
			0xf7,
		]);
		//global time offset for when we started playing timecode.
		//used to keep track of scheduling.
		this._playerStart = window.performance.now();

		//time between frames
		const intervalTime = 1000 / TCSpeeds[this.framerate];
		//the absolute time for the next frame scheduling.
		// scheduling happens every 2 frames,
		let nextAt =
			intervalTime * (this._frameCounter + 2) + this._playerStart;

		//send the first two frames of tc, starting at current frame
		//Pass a copy of the current frame so the operation is atomic
		const { h, m, s, f } = this._time;
		this.scheduleFrames({ h, m, s, f });

		//go to next frame after 1/fr seconds. Broadcast new time to subscribers
		setTimeout(() => {
			this.advanceFrame();
			this.timeSub.next(this._time);
		}, 1000 / TCSpeeds[this.framerate]);

		const wrapper = () => {
			//Play 2 frames of tc
			const { h, m, s, f } = this._time;
			this.scheduleFrames({ h, m, s, f });
			nextAt =
				intervalTime * (this._frameCounter + 2) + this._playerStart;

			//advance one frame now, advance again in 1 frames time
			this.advanceFrame();
			this.timeSub.next(this._time);

			setTimeout(() => {
				this.advanceFrame();
				this.timeSub.next(this._time);
			});

			//call this function again in 2 frames time.
			//adjust for missed timing from this timeout.
			this.playerTimeout = setTimeout(
				wrapper,
				nextAt - window.performance.now()
			);
		};

		//start timeout loop
		this.playerTimeout = setTimeout(
			wrapper,
			nextAt - window.performance.now()
		);
	}

	//Schedule 2 frames of timecode to be sent from midi output.
	scheduleFrames(startFrame: TCtime) {
		let dataBytes = [0, 0, 0, 0, 0, 0, 0, 0].map((_, i) => i << 4);

		//desired schedule start time for these two frames
		const baseTime = (1000 / TCSpeeds[this.framerate]) * this._frameCounter;
		//interval time between quarter frames for this set of frames.
		const quarterFrameTime = 250 / TCSpeeds[this.framerate];

		//get the next frame up to be scheduled
		const nextFrame = this.nextFrameUp(startFrame);

		dataBytes[0] += startFrame.f & 0x0f;
		dataBytes[1] += (startFrame.f & 0xf0) >> 4;
		dataBytes[2] += startFrame.s & 0x0f;
		dataBytes[3] += (startFrame.s & 0xf0) >> 4;
		dataBytes[4] += nextFrame.m & 0x0f;
		dataBytes[5] += (nextFrame.m & 0xf0) >> 4;
		dataBytes[6] += nextFrame.h & 0x0f;
		dataBytes[7] += (this.framerate << 1) & 0x06;

		for (let i = 0; i < dataBytes.length; i++) {
			webmidi.outputs[this.activeOutput!].sendTimecodeQuarterFrame(
				dataBytes[i],
				{
					time: this._playerStart + baseTime + quarterFrameTime * i,
				}
			);
		}

		this._frameCounter += 2;
	}

	pause() {
		if (this.playerTimeout && this.isPlaying) {
			clearTimeout(this.playerTimeout);
			this.isPlaying = false;
		}
	}

	//Returns the next frame of TC after the prop frame
	nextFrameUp(frame: TCtime): TCtime {
		//TODO: add condition for 29.97 framerate
		let { h, m, s, f } = frame;
		f += 1;
		if (f >= TCSpeeds[this.framerate]) {
			s += 1;
			f = 0;
		}
		if (s === 60) {
			m += 1;
			s = 0;
		}
		if (m === 60) {
			h += 1;
			m = 0;
		}
		if (h === 24) {
			h = 0;
		}

		return { h, m, s, f };
	}

	advanceFrame() {
		this._time = this.nextFrameUp(this._time);
	}

	setTimeFromMs(time: number) {
		const h = Math.floor(time / msPerHour) + this.offset.h;
		time %= msPerHour;
		const m = Math.floor(time / msPerMin) + this.offset.m;
		time %= msPerMin;
		const s = Math.floor(time / msPerS) + this.offset.s;
		time %= msPerS;

		const f =
			Math.floor((time * TCSpeeds[this.framerate]) / 1000) +
			this.offset.f;
		this._time = { h, m, s, f };
		this.timeSub.next(this._time);
		this._playerStart = window.performance.now();
		this._frameCounter = 0;
	}

	getActiveOutput(): Output {
		if (!this.activeOutput) {
			throw new Error('No active midi output');
		}
		return webmidi.outputs[this.activeOutput];
	}

	getActiveInput(): Input {
		if (!this.activeInput) {
			throw new Error('No active midi input');
		}
		return webmidi.inputs[this.activeInput];
	}
}

export let midiTcPlayer = new MidiTcPlayer();
