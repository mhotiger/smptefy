import { action } from "typesafe-actions";
import { CLEAR_TRACK_OFFSETS, SET_TRACKS_OFFSETS, TrackOffsetAction, TrackOffsetState, UPDATE_TRACK_OFFSET } from "./types";
import produce from 'immer'

const initialState: TrackOffsetState = {}


export const trackOffsetReducer = produce((state:TrackOffsetState, action: TrackOffsetAction): TrackOffsetState=>{
    switch (action.type){
        case CLEAR_TRACK_OFFSETS:
            return initialState;
        case SET_TRACKS_OFFSETS:
            return action.offsets
        case UPDATE_TRACK_OFFSET:
            return {...state, [`${action.id}`]: action.time}
    }
},initialState)