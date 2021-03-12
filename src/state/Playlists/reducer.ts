import { PlaylistAction, PlaylistState } from "./types";


const initialState: PlaylistState = {
    playlists: []
}

export const playlistReducer= (state: PlaylistState = initialState, action: PlaylistAction): PlaylistState =>{
    switch(action.type){
        case 'ADD_PLAYLISTS':
            return {playlists: action.payload}
        case 'CLEAR_PLAYLISTS':
            return initialState;

        default:
            return state;
    }
}