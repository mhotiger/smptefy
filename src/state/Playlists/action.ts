import { ADD_PLAYLISTS, CLEAR_PLAYLISTS, FETCH_PLAYLISTS, PlaylistAction } from "./types"

export const addPlaylists = (playlists: SpotifyApi.PlaylistObjectFull[]): PlaylistAction =>{
    
    return{
        type: ADD_PLAYLISTS,
        payload: playlists
    }
}

export const clearPlaylists = ():PlaylistAction =>{
    return{
        type: CLEAR_PLAYLISTS
    }
}

export const fetchPlaylists = (): PlaylistAction =>{
   
    return{
        type: FETCH_PLAYLISTS
    }
}