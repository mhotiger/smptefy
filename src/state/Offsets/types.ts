import { TCtime } from "utils/Midi/types"

export const SET_TRACKS_OFFSETS = 'SET_TRACK_OFFSETS'
export const CLEAR_TRACK_OFFSETS = 'CLEAR_TRACK_OFFSETS'
export const UPDATE_TRACK_OFFSET = 'UPDATE_TRACK_OFFSET'


export interface TrackOffsetState{
    [key: string]: TCtime
}


export interface SetTrackOffsetAction  {
    type: typeof SET_TRACKS_OFFSETS
    offsets: TrackOffsetState
}

export interface ClearTrackOffsetsAction {
    type: typeof CLEAR_TRACK_OFFSETS
}


export interface UpdateTrackOffsetAction{
    type: typeof UPDATE_TRACK_OFFSET
    id: string
    time: TCtime;
}

export type TrackOffsetAction = 
    SetTrackOffsetAction |
    ClearTrackOffsetsAction |
    UpdateTrackOffsetAction 