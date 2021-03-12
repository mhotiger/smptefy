export const FETCH_TRACKS = 'FETCH_TRACKS'
export const ADD_TRACKS = 'ADD_TRACKS'
export const CLEAR_TRACKS = 'CLEAR_TRACKS'
export const SET_TRACK_SOURCE_ID = 'SET_TRACK_SOURCE_ID'
export const SET_PLAYLIST_SOURCE = 'SET_PLAYLIST_SOURCE'

export const ALBUM = 'albums'
export const PLAYLIST = 'playlists'
export type SourceIdType = typeof ALBUM | typeof PLAYLIST

export type StateTrackType = SpotifyApi.TrackObjectFull  
export interface TracksState{
    tracks: StateTrackType[]
    sourceType: SourceIdType
    playlistSource: SpotifyApi.PlaylistObjectFull | undefined
    id?: string
}

export interface FetchTrackAction{
    type: typeof FETCH_TRACKS
}

export interface AddTrackAction{
    type: typeof ADD_TRACKS
    payload: StateTrackType[]
}

export interface ClearTracksAction{
    type: typeof CLEAR_TRACKS
}

export interface SetTrackSourceIdAction{
    type: typeof SET_TRACK_SOURCE_ID
    sourceType: SourceIdType
    id: string
}

export interface SetPlaylistSourceAction{
    type: typeof SET_PLAYLIST_SOURCE,
    playlistSource: SpotifyApi.PlaylistObjectFull
}

export type TrackAction = FetchTrackAction
    | AddTrackAction
    | ClearTracksAction
    | SetTrackSourceIdAction
    | SetPlaylistSourceAction