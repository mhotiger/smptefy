import { Dispatch } from "redux";
import { BehaviorSubject, Subject } from "rxjs";

export const INIT_SPOTIFY = 'INIT_SPOTIFY'
export const SET_SPOTIFY_PLAYER = 'SET_SPOTIFY_PLAYER'
export const SET_SPOTIFY_READY = 'SET_SPOTIFY_READY'
export const SET_SPOTIFY_PLAYBACK_STATE = 'SET_SPOTIFY_PLAYBACK_STATE'
export const SET_SPOTIFY_DEVICE_ID = 'SET_SPOTIFY_DEVICE_ID'
export const SPOTIFY_PLAYBACK_READY = 'SPOTIFY_PLAYBACK_READY'
export const SPOTIFY_PLAY_TRACK = 'SPOTIFY_PLAY_TRACK'
export const SPOTIFY_PLAY = 'SPOTIFY_PLAY'
export const SPOTIFY_PAUSE = 'SPOTIFY_PAUSE'
export const SPOTIFY_TOGGLE_PLAYBACK = 'SPOTIFY_TOGGLE_PLAYBACK'
export const SPOTIFY_STATE_CHANGED = 'SPOTIFY_STATE_CHANGED'
export const SPOTIFY_SEEK = 'SPOTIFY_SEEK'


export interface SpotifyPlayerState{
    player?: Spotify.SpotifyPlayer,
    playbackState?: Spotify.PlaybackState,
    playbackPos$: BehaviorSubject<number>,
    paused$: BehaviorSubject<boolean>,
    isReadyToInit: boolean,
    isReady: boolean,
    device_id?: string
}




export interface InitSpotifyAction{
    type: typeof INIT_SPOTIFY
    dispatch: Dispatch<any>
}


export interface SetSpotifyPlayerAction{
    type: typeof SET_SPOTIFY_PLAYER
    player: Spotify.SpotifyPlayer
}

export interface SetSpotifyReadyInitAction{
    type: typeof SET_SPOTIFY_READY
    isReady: boolean
}

export interface SetSpotifyPlayBackStateAction{
    type: typeof SET_SPOTIFY_PLAYBACK_STATE
    playbackState: Spotify.PlaybackState
}

export interface SetSpotifyDeviceId{
    type: typeof SET_SPOTIFY_DEVICE_ID
    device_id: string | undefined;
}

export interface SpotifyReadyAction{
    type: typeof SPOTIFY_PLAYBACK_READY
    isReady: boolean
}

export interface SpotifyPlayTrackAction{
    type: typeof SPOTIFY_PLAY_TRACK
    trackUri: string
}

export interface SpotifyPlayAction{
    type: typeof SPOTIFY_PLAY
}

export interface SpotifyPauseAction{
    type: typeof SPOTIFY_PAUSE
}

export interface SpotifyTogglePlaybackAction{
    type: typeof SPOTIFY_TOGGLE_PLAYBACK
}

export interface SpotifyStateChangedAction{
    type: typeof SPOTIFY_STATE_CHANGED,
    playbackState: Spotify.PlaybackState
}

export interface SpotifySeekAction{
    type: typeof SPOTIFY_SEEK
    time: number
}




export type SpotifyPlayerAction = 
    SetSpotifyPlayBackStateAction |
    SetSpotifyReadyInitAction |
    SetSpotifyPlayerAction |
    InitSpotifyAction|
    SetSpotifyDeviceId |
    SpotifyReadyAction |
    SpotifyPauseAction |
    SpotifyPlayAction | 
    SpotifyPlayTrackAction |
    SpotifyTogglePlaybackAction |
    SpotifyStateChangedAction |
    SpotifySeekAction