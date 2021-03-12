export const ADD_PLAYLISTS = 'ADD_PLAYLISTS'
export const CLEAR_PLAYLISTS = 'CLEAR_PLAYLISTS'
export const FETCH_PLAYLISTS = 'FETCH_PLAYLISTS'

export interface PlaylistState{
    playlists: SpotifyApi.PlaylistObjectFull[]
}


export interface AddPlaylistAction{
    type: typeof ADD_PLAYLISTS
    payload: SpotifyApi.PlaylistObjectFull[]
}

export interface ClearPlaylistAction{
    type: typeof CLEAR_PLAYLISTS
}

export interface FetchPlaylistAction{
    type: typeof FETCH_PLAYLISTS
}

export type PlaylistAction = AddPlaylistAction | ClearPlaylistAction | FetchPlaylistAction