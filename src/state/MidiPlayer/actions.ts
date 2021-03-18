import { getJSDocReturnType } from 'typescript';
import { MidiTcPlayer } from 'utils/Midi/midiPlayer';
import { TCFramerate, TCtime } from 'utils/Midi/types';
import {
	INIT_MIDI,
	MidiAction,
	PAUSE_MIDI,
	PLAY_MIDI,
	RESEST_MIDI,
	SET_MIDI_CLOCK_OFFSET,
	SET_MIDI_CLOCK_MS,
	SET_MIDI_FRAMERATE,
	SET_MIDI_PLAYER,
	SET_MIDI_PLAY_STATE,
	TEST_MIDI,
	TOGGLE_MIDI,
	SET_MIDI_OUTPUT,
	SET_MIDI_INPUT,
} from './types';

export const setMidiPlayerAction = (player: MidiTcPlayer): MidiAction => {
	return {
		type: SET_MIDI_PLAYER,
		player,
	};
};

export const initMidiAction = (): MidiAction => {
	return {
		type: INIT_MIDI,
	};
};

export const resetMidiAction = (): MidiAction => {
	return {
		type: RESEST_MIDI,
	};
};

export const playMidiAction = (): MidiAction => {
	return {
		type: PLAY_MIDI,
	};
};

export const pauseMidiAction = (): MidiAction => {
	return {
		type: PAUSE_MIDI,
	};
};

export const toggleMidiAction = (): MidiAction => {
	return {
		type: TOGGLE_MIDI,
	};
};

export const setMidiClockAction = (time: TCtime): MidiAction => {
	return {
		type: SET_MIDI_CLOCK_OFFSET,
		time,
	};
};

export const setMidiClockMsAction = (time: number): MidiAction => {
	return {
		type: SET_MIDI_CLOCK_MS,
		time,
	};
};

export const setMidiFramerateAction = (rate: TCFramerate): MidiAction => {
	return {
		type: SET_MIDI_FRAMERATE,
		rate,
	};
};

export const setMidiPlayStateAction = (isPlaying: boolean): MidiAction => {
	return {
		type: SET_MIDI_PLAY_STATE,
		isPlaying,
	};
};

export const testMidiAction = (): MidiAction => {
	return {
		type: TEST_MIDI,
		date: Date.now(),
	};
};

export const setMidiOutputAction = (output: number): MidiAction => {
	return {
		type: SET_MIDI_OUTPUT,
		output,
	};
};

export const setMidiInputAction = (input: number): MidiAction => {
	return {
		type: SET_MIDI_INPUT,
		input,
	};
};
