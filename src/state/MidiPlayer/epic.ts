import { Epic } from "redux-observable";
import { merge, of } from "rxjs";
import { delay, filter, mergeMap } from "rxjs/operators";
import { AllActions, RootState } from "state";
import { MidiTcPlayer } from "utils/Midi/midiPlayer";
import { setMidiPlayerAction, testMidiAction } from "./actions";
import { INIT_MIDI, TOGGLE_MIDI } from "./types";


export const midiPlayerEpic: Epic<AllActions, AllActions, RootState, void> = (action$, state$)=>{
    return action$.pipe(
        filter((action)=>action.type === INIT_MIDI),
        mergeMap(()=>{
            return state$.value.midi.player.init()
        }),
        mergeMap((player: MidiTcPlayer)=>{
            return of(setMidiPlayerAction(player))
        })
    )
}


export const testMidiPlayerEpic: Epic<AllActions, AllActions, RootState, void> = (action$) =>{
    return action$.pipe(
        filter((action)=>action.type === TOGGLE_MIDI),
        mergeMap(()=>{
            return merge(
                of(testMidiAction()),
                of(testMidiAction()).pipe(delay(3000))
            )
        })
    )
    
}

