import { Dispatch } from "redux";
import { INIT_SPOTIFY, SET_SPOTIFY_DEVICE_ID, SET_SPOTIFY_PLAYBACK_STATE, SET_SPOTIFY_PLAYER, SET_SPOTIFY_READY, SpotifyPlayerAction, SPOTIFY_PAUSE, SPOTIFY_PLAY, SPOTIFY_PLAYBACK_READY, SPOTIFY_PLAY_TRACK, SPOTIFY_SEEK, SPOTIFY_STATE_CHANGED, SPOTIFY_TOGGLE_PLAYBACK } from "./types";


export const initSpotifyAction = (dispatch: Dispatch<any>):SpotifyPlayerAction=>{
    return{
        type: INIT_SPOTIFY,
        dispatch
    }
}

export const setSpotifyPlayerAction = (player: Spotify.SpotifyPlayer): SpotifyPlayerAction =>{
    return{
        type: SET_SPOTIFY_PLAYER,
        player
    }
}

export const setSpotifyReadyAction = (isReady: boolean): SpotifyPlayerAction =>{
    return{
        type: SET_SPOTIFY_READY,
        isReady
    }
}

export const setSpotifyDeviceIdAction = (device_id: string | undefined): SpotifyPlayerAction =>{
    return (device_id)?{
        type: SET_SPOTIFY_DEVICE_ID,
        device_id
    }:
    {
        type: SET_SPOTIFY_DEVICE_ID,
        device_id: undefined
    }
}

export const setSpotifyPlaybackState = (playbackState: Spotify.PlaybackState): SpotifyPlayerAction =>{
    return{
        type: SET_SPOTIFY_PLAYBACK_STATE,
        playbackState
    }
}

export const spotifyPlaybackReadyAction = (isReady: boolean):SpotifyPlayerAction =>{
    return{
        type: SPOTIFY_PLAYBACK_READY,
        isReady
    }
}

export const spotifyPlayTrackAction = (trackUri: string):SpotifyPlayerAction =>{
    return{
        type: SPOTIFY_PLAY_TRACK,
        trackUri
    }
}

export const spotifyPlayAction = ():SpotifyPlayerAction=>{
    return {
        type: SPOTIFY_PLAY
    }
}

export const spotifyPauseAction = ():SpotifyPlayerAction=>{
    return{
        type: SPOTIFY_PAUSE
    }
}

export const spotifyTogglePlaybackAction = ():SpotifyPlayerAction=>{
    return{
        type: SPOTIFY_TOGGLE_PLAYBACK
    }
}

export const spotifyStateChangedAction = (playbackState: Spotify.PlaybackState):SpotifyPlayerAction =>{
    return{
        type: SPOTIFY_STATE_CHANGED,
        playbackState
    }
}

export const spotifySeekAction = (time: number):SpotifyPlayerAction =>{
    return{
        type: SPOTIFY_SEEK,
        time
    }
}