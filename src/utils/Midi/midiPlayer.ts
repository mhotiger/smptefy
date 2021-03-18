import { TcpNetConnectOpts } from 'net';
import { ReplaySubject } from 'rxjs';
import { forEachLeadingCommentRange } from 'typescript';
import webmidi, { Input, Output } from 'webmidi';
import { MTCTime } from './MTCTime';
import { fps25, TCFramerate, TCtime } from './types';

const TCSpeeds = [24, 25, 29.97, 30];

export class MidiTcPlayer {
	inputs: Input[];
	outputs: Output[];

	activeInput: Input | undefined;
	activeOutput: Output | undefined;
	activeInputIndex: number | undefined;
	activeOutputIndex: number | undefined;
	private quarterFrameCounter = 0;
	time: MTCTime;
	rate: TCFramerate;
	timeStringSrc = new ReplaySubject<string>(1);
	timeString$ = this.timeStringSrc.asObservable();
	playerStart?: DOMHighResTimeStamp;
	log: string;
	frameCount: number;

	isPlaying: Boolean = false;
	playerTimeout: NodeJS.Timeout | undefined;

	constructor(time?: TCtime, rate?: TCFramerate, offset?: TCtime) {
		const t = time ? time : { h: 0, m: 0, s: 0, f: 0 };
		const r = rate ? rate : fps25;
		const o = offset ? offset : { h: 2, m: 0, s: 5, f: 0 };
		this.time = new MTCTime(t, r, o);
		this.rate = this.time.rate;
		this.inputs = [];
		this.outputs = [];
		this.log = '';
		this.frameCount = 0;
	}

	async init() {
		this.timeStringSrc.next(this.time.str);
		const { inputs, outputs } = await this.webMidiEnablePromise();
		this.inputs = inputs;
		this.outputs = outputs;
		this.activeInput = this.inputs ? this.inputs[0] : undefined;
		this.activeOutput = this.outputs ? this.outputs[0] : undefined;
		this.activeOutputIndex = this.outputs && 0;
		this.activeInputIndex = this.inputs && 0;
		webmidi.addListener('connected', (e) => console.log(e));
		webmidi.addListener('disconnected', (e) => console.log(e));
		return this;
	}

	webMidiEnablePromise(): Promise<any> {
		return new Promise((resolve, reject) => {
			webmidi.enable((err) => {
				if (err) return reject(err);
				else {
					return resolve({
						inputs: webmidi.inputs,
						outputs: webmidi.outputs,
					});
				}
			}, true);
		});
	}

	setClock(time: MTCTime) {
		this.time = time;
	}

	setInput(inputIndex: number) {
		if (inputIndex < this.inputs.length) {
			this.activeInput = this.inputs[inputIndex];
		}
	}

	setOutput(outputIndex: number) {
		if (outputIndex < this.outputs.length) {
			this.activeOutput = this.outputs[outputIndex];
		}
	}

	testPlay(): void {
		if (this.playerTimeout) {
			console.error('Already a TC slot playing');
			return;
		}
		if (!this.activeOutput) {
			console.error('No midi output!');
			return;
		}
		this.isPlaying = true;

		const intervalTime = (1000 * 2) / TCSpeeds[this.rate];
		let nextAt = intervalTime + Date.now();

		this.playerStart = window.performance.now();
		let hourbyte = (this.time.time.h + (this.rate << 1)) & 0x06;
		this.activeOutput.send(0xf0, [
			0x7f,
			0x7f,
			0x01,
			0x01,
			hourbyte,
			this.time.time.m,
			this.time.time.s,
			this.time.time.f,
			0xf7,
		]);

		let nextRem = 0;
		nextRem += nextAt - Math.floor(nextAt);
		if (nextRem > 1) {
			nextAt += 1;
			nextRem -= 1;
		}

		this.scheduleFrames(
			this.time.getCurrentFrame(),
			this.time.getNextFrame(this.time.getCurrentFrame())
		);
		this.scheduleFrames(
			this.time.getNextFrame(
				this.time.getNextFrame(this.time.getCurrentFrame())
			),
			this.time.getNextFrame(
				this.time.getNextFrame(
					this.time.getNextFrame(this.time.getCurrentFrame())
				)
			)
		);
		setTimeout(() => {
			this.time.advanceFrame();
			this.timeStringSrc.next(this.time.str);
		}, 1000 / TCSpeeds[this.rate]);

		console.log('nextRem: ', nextRem, '\tnextAt: ', nextAt);
		const wrapper = () => {
			this.scheduleFrames(
				this.time.getNextFrame(
					this.time.getNextFrame(this.time.getCurrentFrame())
				),
				this.time.getNextFrame(
					this.time.getNextFrame(
						this.time.getNextFrame(this.time.getCurrentFrame())
					)
				)
			);

			this.time.advanceFrame();

			this.timeStringSrc.next(this.time.toString());
			nextAt += intervalTime;
			nextRem += nextAt - Math.floor(nextAt);
			if (nextRem > 1) {
				nextAt += 1;
				nextRem -= 1;
			}
			setTimeout(() => {
				this.time.advanceFrame();
				this.timeStringSrc.next(this.time.str);
			}, 1000 / TCSpeeds[this.rate]);
			// console.log("nextRem: ", nextRem ,"\tnextAt: ", nextAt,'\tnextAtRounded:', Math.floor(nextAt), '\tdiff: ', Date.now()-startTime)
			// this.log.push(`nextrem: ${nextRem} \tNextAt: ${nextAt} \tnextAtRounded: ${Math.floor(nextAt)} \t diff: ${Date.now()-startTime}`)

			// this.log =this.log + `${index} \t ${window.performance.now() -last} \t${window.performance.now()-this.playerStart!}\n`
			// last = window.performance.now();
			// index++

			this.playerTimeout = setTimeout(wrapper, nextAt - Date.now());
		};

		this.playerTimeout = setTimeout(wrapper, nextAt - Date.now());
	}

	scheduleFrames(thisFrame: TCtime, nextFrame: TCtime): void {
		// console.log('scheduling: ',window.performance.now()-this.playerStart!)
		let dataBytes = [0, 0, 0, 0, 0, 0, 0, 0].map((_, i) => i << 4);
		const baseTime = (1000 / TCSpeeds[this.rate]) * this.frameCount;
		const quarterFrameTime = 250 / TCSpeeds[this.rate];

		dataBytes[0] += thisFrame.f & 0x0f;
		dataBytes[1] += (thisFrame.f & 0xf0) >> 4;
		dataBytes[2] += thisFrame.s & 0x0f;
		dataBytes[3] += (thisFrame.s & 0xf0) >> 4;
		dataBytes[4] += nextFrame.m & 0x0f;
		dataBytes[5] += (nextFrame.m & 0xf0) >> 4;
		dataBytes[6] += nextFrame.h & 0x0f;
		dataBytes[7] += (nextFrame.h & 0xf0) >> 4;
		dataBytes[7] += (this.rate << 1) & 0x06;

		// console.log('base time: ', baseTime)
		if (this.playerStart! + baseTime - window.performance.now() < 0) {
			//we're trying to schedule too late.
			console.log(
				'Missed the window: ',
				baseTime,
				'\tdesired:',
				this.playerStart! + baseTime,
				'\tactual',
				window.performance.now()
			);
		}

		for (let i = 0; i < dataBytes.length; i++) {
			this.activeOutput!.sendTimecodeQuarterFrame(dataBytes[i], {
				time: this.playerStart! + baseTime + quarterFrameTime * i,
			});
		}

		this.frameCount += 2;
	}

	play(): void {
		if (this.playerTimeout) {
			console.error('There is already a TC slot playing');
			return;
		}
		this.isPlaying = true;
		this.quarterFrameCounter = 0;
		if (!this.activeOutput) {
			console.error('there is no active midi output');
			return;
		}
		let hourbyte = (this.time.time.h + (this.time.rate << 1)) & 0x06;
		this.activeOutput.send(0xf0, [
			0x7f,
			0x7f,
			0x01,
			0x01,
			hourbyte,
			this.time.time.m,
			this.time.time.s,
			this.time.time.f,
			0xf7,
		]);
		let last = window.performance.now();
		let index = 0;
		var self = this;
		this.playerTimeout = setInterval(() => {
			console.log('oldtimer');
			var dataByte = 0;
			dataByte += self.quarterFrameCounter << 4;
			const t = self.time.time;
			if (self.quarterFrameCounter === 0) {
				self.time.advanceFrame();
				self.timeStringSrc.next(self.time.str);

				dataByte += t.f & 0x0f;
			} else if (self.quarterFrameCounter === 1) {
				dataByte += (t.f & 0xf0) >>> 4;
			} else if (self.quarterFrameCounter === 2) {
				dataByte += t.s & 0x0f;
			} else if (self.quarterFrameCounter === 3) {
				dataByte += (t.s & 0xf0) >>> 4;
			} else if (self.quarterFrameCounter === 4) {
				self.time.advanceFrame();
				self.timeStringSrc.next(self.time.str);

				dataByte += t.m & 0x0f;
			} else if (self.quarterFrameCounter === 5) {
				dataByte += (t.m & 0xf0) >>> 4;
			} else if (self.quarterFrameCounter === 6) {
				dataByte += t.h & 0x0f;
			} else if (self.quarterFrameCounter === 7) {
				dataByte += (t.h & 0xf0) >>> 4;
				dataByte += (self.time.rate << 1) & 0x06;
			}

			this.log =
				this.log +
				`${index}\t${
					window.performance.now() - last
				}\t ${window.performance.now()}\n`;
			last = window.performance.now();
			index++;

			//console.log(self.quarterFrameCounter);
			//console.log('0x' + dataByte.toString(16));
			//console.log(self.time.h + ':' + self.time.m + ':' + self.time.s + ':' + self.time.f);
			self.activeOutput!.sendTimecodeQuarterFrame(dataByte);

			self.quarterFrameCounter += 1;
			self.quarterFrameCounter %= 8;
		}, 10);
	}

	pause() {
		console.log(this.log);
		this.isPlaying = false;
		if (this.playerTimeout) {
			clearInterval(this.playerTimeout);
			this.playerTimeout = undefined;
		}
	}

	togglePlay() {
		this.isPlaying ? this.pause() : this.play();
	}

	setTimeByMs(time: number) {
		this.time.setTimeFromMsOffset(time);
		//keep subject update in a separate callback so redux doesnt get angry
		setTimeout(() => {
			this.timeStringSrc.next(this.time.str);
		}, 0);
	}
}
