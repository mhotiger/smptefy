import { TCtime } from "utils/Midi/types";
import { CLEAR_TRACK_OFFSETS,  SET_TRACKS_OFFSETS, TrackOffsetAction, TrackOffsetState, UPDATE_TRACK_OFFSET } from "./types";


export const setTrackOffsetsAction = (offsets: TrackOffsetState): TrackOffsetAction => {
    return {
        type: SET_TRACKS_OFFSETS,
        offsets
    }
}

export const clearTracksOffsetsAction = ():TrackOffsetAction=>{
    return{
        type: CLEAR_TRACK_OFFSETS
    }
}

export const updateTrackOffsetAction = (id: string, time: TCtime): TrackOffsetAction=>{
    return{
        type: UPDATE_TRACK_OFFSET,
        id,
        time
    }
}