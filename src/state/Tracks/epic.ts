import { Epic } from "redux-observable";
import { AllActions, RootState } from "state";
import { catchError, filter, map, mergeMap, retryWhen } from 'rxjs/operators'
import { isOfType } from 'typesafe-actions'
import { FETCH_TRACKS } from "./types";
import { getAuthToken } from "utils/auth";
import { ajax } from "rxjs/ajax";
import { addTracks } from "./actions";
import { requestErrorStrategy, retryStrategy } from "state/strategies";
import { defer } from "rxjs";

export const trackEpic: Epic<AllActions, AllActions, RootState, void> = (action$, state$)=>{
    return action$.pipe(
        filter(isOfType(FETCH_TRACKS)),
        mergeMap(()=>{
            const sourceType = state$.value.tracks.sourceType
            const id = state$.value.tracks.id
            
            return defer( () =>ajax.getJSON
            <SpotifyApi.PlaylistTrackResponse>(`https://api.spotify.com/v1/${sourceType}/${id}/tracks`,
            {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            })).pipe(
                map((response: SpotifyApi.PlaylistTrackResponse)=>{
                    const tracks = response.items.map((i)=>i.track)
                    return addTracks(tracks)
                }),
                retryWhen(retryStrategy()),
                catchError(requestErrorStrategy())
            )
             
        }),
        
        catchError(requestErrorStrategy())

    )
}