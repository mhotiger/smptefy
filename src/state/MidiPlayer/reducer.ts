import { MidiTcPlayer } from "utils/Midi/midiPlayer";
import { MidiAction, MidiPlayerState, PAUSE_MIDI, PLAY_MIDI, SET_MIDI_CLOCK_MS, SET_MIDI_CLOCK_OFFSET, SET_MIDI_PLAYER, SET_MIDI_PLAY_STATE, TOGGLE_MIDI } from "./types";
import produce from 'immer'
import { fps30 } from "utils/Midi/types";

const initialState: MidiPlayerState = {
    player : new MidiTcPlayer({h:0, m:0, s:0, f:0},fps30,{h:0,m:0,s:0,f:0})
}

export const midiPlayerReducer = produce((state: MidiPlayerState, action: MidiAction): MidiPlayerState=>{
    const player = state.player;
    switch(action.type){
        case PAUSE_MIDI:
            player.pause()
            state.player = player;
            return state;
        case PLAY_MIDI:
            // player.play()
            player.testPlay();
            state.player = player;
            return state;
        case TOGGLE_MIDI:
            if(player.isPlaying){
                player.pause()
                state.player = player;
                return state
            }
            // player.play()
            player.testPlay()
            state.player = player;
            return state;

        case SET_MIDI_PLAYER:
            
            state.player = action.player
            return state;
        
        case SET_MIDI_CLOCK_MS:
            state.player.setTimeByMs(action.time)
            return state;

        case SET_MIDI_PLAY_STATE:
            if(state.player.isPlaying && !action.isPlaying){
                state.player.pause();
            }else if(!state.player.isPlaying && action.isPlaying){
                // state.player.play();
                state.player.testPlay();
            }
            return state;
        
        case SET_MIDI_CLOCK_OFFSET:
            state.player.time.setOffset(action.time)
            return state;

        default:
            return state;
            
    }
},initialState)