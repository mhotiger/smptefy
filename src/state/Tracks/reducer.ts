import { SET_PLAYLIST_SOURCE, TrackAction, TracksState } from "./types";

const initialState: TracksState = {
    tracks: [],
    sourceType: 'playlists',
    playlistSource: undefined,
    id: undefined
}

export const tracksReducer = (state: TracksState = initialState, action: TrackAction): TracksState=>{
    switch(action.type){
        case SET_PLAYLIST_SOURCE:
            return{
                ...state,
                playlistSource: action.playlistSource
            }

        case 'ADD_TRACKS':
            return{
                ...state,
                tracks : [...state.tracks].concat(action.payload)
            }
        case 'CLEAR_TRACKS':
            return{
                ...state,
                tracks: [],
                playlistSource: undefined
            }
        case 'SET_TRACK_SOURCE_ID':
            return {
                ...state,
                id: action.id,
                sourceType: action.sourceType
            }
        default:
            return state;
    }
}