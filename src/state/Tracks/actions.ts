import { ADD_TRACKS, CLEAR_TRACKS, FETCH_TRACKS, SET_PLAYLIST_SOURCE, SET_TRACK_SOURCE_ID, SourceIdType, StateTrackType, TrackAction } from "./types"

export const fetchTracks = (): TrackAction=>{
    return {
        type: FETCH_TRACKS
    }
}

export const addTracks = (tracks: StateTrackType[]): TrackAction =>{
    return {
        type: ADD_TRACKS,
        payload: tracks
    }
}

export const clearTracks = (): TrackAction =>{
    return{
        type: CLEAR_TRACKS
    }
}

export const setTrackSourceId = (sourceType: SourceIdType, id: string): TrackAction=>{
    return{
        type: SET_TRACK_SOURCE_ID,
        sourceType,
        id
    }
}


export const setPlaylistSourceAction = (playlistSource: SpotifyApi.PlaylistObjectFull): TrackAction =>{
    return{
        type: SET_PLAYLIST_SOURCE,
        playlistSource
    }
}