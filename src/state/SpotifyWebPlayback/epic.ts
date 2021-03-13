import { diff } from "deep-object-diff";
import { stat } from "fs";
import { combineEpics, Epic } from "redux-observable";
import { defer, interval, merge, of } from "rxjs";
import { ajax } from "rxjs/ajax";
import { catchError, filter, map, mergeMap, retry, retryWhen, switchMap, tap } from "rxjs/operators";
import { AllActions, noopAction, RootState } from "state";
import { setError } from "state/Error/action";
import { pauseMidiAction, setMidiClockMsAction, setMidiPlayStateAction } from "state/MidiPlayer/actions";
import { requestErrorStrategy, retryStrategy } from "state/strategies";
import { getAuthToken } from "utils/auth";
import { setSpotifyPlaybackState, spotifyPauseAction, spotifyPlayAction } from "./actions";
import { SPOTIFY_PLAY_TRACK, SpotifyPlayTrackAction, SPOTIFY_STATE_CHANGED, SpotifyStateChangedAction, SPOTIFY_PLAY, SPOTIFY_PAUSE, SPOTIFY_TOGGLE_PLAYBACK, SPOTIFY_SEEK, SpotifySeekAction, PlaybackState } from "./types";
 
export const spotifyPlayTrackEpic: Epic<AllActions, AllActions, RootState, void> = (action$, state$)=>{
    return action$.pipe(
        filter((action)=>action.type === SPOTIFY_PLAY_TRACK),
        map((action)=>action as SpotifyPlayTrackAction),
        tap((action)=>{
            console.log("play track action: ",action)
            if(!state$.value.spotify.isReady){
                throw new Error('Spotify Web Playback Not Ready')
            }
        }),
        switchMap((action)=>{
            return defer(()=>ajax({
                url:`https://api.spotify.com/v1/me/player/play?device_id=${state$.value.spotify.device_id}`,
                method: 'PUT',
                headers:{
                    'Authorization':`Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({uris: [action.trackUri]})
            })).pipe(
                retryWhen(retryStrategy()),
                catchError(requestErrorStrategy())
            )
        }),
        mergeMap(()=>{
            return merge(
                of(pauseMidiAction()),
                
            )

        }),
        catchError(requestErrorStrategy())

    )
}


export const spotifyStateChangedEpic: Epic<AllActions,AllActions, RootState, void> = (action$, state$)=>{
    return action$.pipe(
        filter((action) => action.type === SPOTIFY_STATE_CHANGED),
        map((action) => action as SpotifyStateChangedAction),
        tap((action)=>{
            state$.value.spotify.playbackPos$.next(action.playbackState.position)
            state$.value.spotify.paused$.next(action.playbackState.paused)
        }),
        
        switchMap((action)=>{
            // state$.value.spotify.playbackPos$.next(action.playbackState.position)
            if(action.playbackState.paused){
                return merge(
                    of(pauseMidiAction()),
                    of(setSpotifyPlaybackState(action.playbackState))
                )   
            }
            //const playbackPos = action.playbackState.position +(Date.now()-action.playbackState.timestamp)
            return interval(100).pipe(
                switchMap(async ()=>{
                    const playbackState = await state$.value.spotify.player!.getCurrentState(); 
                    return {...playbackState} as PlaybackState;                  
                }),
                switchMap((state: PlaybackState | null)=>{
                    if(state){  
                        const timediff = Date.now()- state.timestamp;
                        // console.log("state from the interval", state)   
                        return merge(
                            of(setSpotifyPlaybackState(state)),
                            of(setMidiPlayStateAction(!state.paused)),
                            of(setMidiClockMsAction(state.position ))
                        )
                    
                    }else{
                        return merge(
                            of(pauseMidiAction()),
                            of(setSpotifyPlaybackState(action.playbackState))
                        )
                    }
                }),
            )
        }),
        
    )
}


const spotifyPlayPauseEpic: Epic<AllActions, AllActions, RootState, void> = (action$, state$) =>{
    return action$.pipe(
        filter((action)=>{
            return(
                action.type === SPOTIFY_PLAY ||
                action.type === SPOTIFY_PAUSE ||
                action.type === SPOTIFY_TOGGLE_PLAYBACK
            )
        }),
        map((action)=>{
            console.log("spotfy playpause epic")
            const spotify = state$.value.spotify
            switch(action.type){
                
                case SPOTIFY_PLAY:
                    if(spotify.player
                        && spotify.playbackState
                        && spotify.playbackState.paused){
                            if(spotify.playbackState.disallows['resuming']){
                                return setError({msg:
                                    `Cannot play: 
                                    ${spotify.playbackState.restrictions
                                        .disallow_resuming_reasons.reduce((a,s)=>a + ', ' + s, '')}`
                                    })
                            }else{
                                spotify.player.resume()
                            }

                    }
                    return noopAction();
    
                case SPOTIFY_PAUSE:
                    if(spotify.player
                        && spotify.playbackState
                        && !spotify.playbackState.paused){
                            if(spotify.playbackState.disallows['pausing']){
                                return setError({msg:
                                    `Cannot play: 
                                    ${spotify.playbackState.restrictions
                                        .disallow_pausing_reasons.reduce((a,s)=>a + ', ' + s, '')}`
                                })
                            }else{
                                spotify.player.pause()
                            }
                    }
                    return noopAction();

                case SPOTIFY_TOGGLE_PLAYBACK:
                    if(spotify.playbackState && spotify.playbackState.paused){
                        return spotifyPlayAction()
                    }
                    return spotifyPauseAction();
                
                default:
                    return noopAction();
                
            }
        }),
        
        retry()
    )
}

const spotifySeekEpic:Epic<AllActions,AllActions,RootState,void> =(action$, state$)=>{
    return action$.pipe(
        filter((action)=>action.type === SPOTIFY_SEEK),
        map((action)=>action as SpotifySeekAction),
        map((action)=>{
            const player = state$.value.spotify.player;
            const playbackState = state$.value.spotify.playbackState;
            if(player && playbackState){
                if(playbackState.disallows['seeking']){
                    return setError({msg: 'Cannot seek'})
                }
                else if(action.time >=0 && action.time < playbackState.duration){
                    player.seek(action.time)
                    
                }
                
                return noopAction();
            }
            else{
                return noopAction()
            }
        })
    )
}





export const spotifyEpic = combineEpics(
    spotifyStateChangedEpic,
    spotifyPlayTrackEpic,
    spotifyPlayPauseEpic,
    spotifySeekEpic
)

