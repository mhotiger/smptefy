import { MidiTcPlayer } from 'utils/Midi/midiPlayer';
import { TCFramerate, TCtime } from 'utils/Midi/types';

export const SET_MIDI_PLAYER = 'SET_MIDI_PLAYER';
export const INIT_MIDI = 'INIT_MIDI';
export const RESEST_MIDI = 'RESET_MIDI';
export const PLAY_MIDI = 'PLAY_MIDI';
export const PAUSE_MIDI = 'PAUSE_MIDI';
export const TOGGLE_MIDI = 'TOGGLE_MIDI';
export const SET_MIDI_CLOCK_OFFSET = 'SET_MIDI_CLOCK';
export const SET_MIDI_CLOCK_MS = 'SET_MIDI_CLOCK_MS';
export const SET_MIDI_FRAMERATE = 'SET_MIDI_FRAMERATE';
export const TEST_MIDI = 'TEST_MIDI';
export const SET_MIDI_PLAY_STATE = 'SET_MIDI_PLAY_STATE';
export const SET_MIDI_OUTPUT = 'SET_MIDI_OUTPUT';
export const SET_MIDI_INPUT = 'SET_MIDI_INPUT';

export interface MidiPlayerState {
	player: MidiTcPlayer;
}

export interface SetMidiPlayerAction {
	type: typeof SET_MIDI_PLAYER;
	player: MidiTcPlayer;
}

export interface InitMidiAction {
	type: typeof INIT_MIDI;
}

export interface ResetMidiAction {
	type: typeof RESEST_MIDI;
}

export interface PlayMidiAction {
	type: typeof PLAY_MIDI;
}

export interface PauseMidiAction {
	type: typeof PAUSE_MIDI;
}

export interface ToggleMidiPlayAction {
	type: typeof TOGGLE_MIDI;
}

export interface SetMidiOffsetAction {
	type: typeof SET_MIDI_CLOCK_OFFSET;
	time: TCtime;
}

export interface SetMidiClockMsAction {
	type: typeof SET_MIDI_CLOCK_MS;
	time: number;
}

export interface SetMidiFramerateAction {
	type: typeof SET_MIDI_FRAMERATE;
	rate: TCFramerate;
}

export interface TestMidiAction {
	type: typeof TEST_MIDI;
	date: number;
}

export interface SetMidiPlayStateAction {
	type: typeof SET_MIDI_PLAY_STATE;
	isPlaying: boolean;
}

export interface SetMidiOutputAction {
	type: typeof SET_MIDI_OUTPUT;
	output: number;
}

export interface SetMidiInputAction {
	type: typeof SET_MIDI_INPUT;
	input: number;
}

export type MidiAction =
	| SetMidiPlayerAction
	| InitMidiAction
	| ResetMidiAction
	| PlayMidiAction
	| PauseMidiAction
	| ToggleMidiPlayAction
	| SetMidiOffsetAction
	| SetMidiClockMsAction
	| SetMidiFramerateAction
	| TestMidiAction
	| SetMidiPlayStateAction
	| SetMidiOutputAction
	| SetMidiInputAction;
