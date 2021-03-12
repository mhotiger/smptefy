import { combineEpics, Epic } from "redux-observable";
import { defer, of } from "rxjs";
import { ajax } from 'rxjs/ajax'
import { filter, mergeMap, map, catchError, retryWhen} from 'rxjs/operators'
import { AllActions, noopAction, RootState } from "state";
import { getAuthToken, setAuthToken } from "utils/auth";
import { fetchSpotifyUserAction, noopUser, rejectUser, setUser } from "./action";
import { FETCH_SPOTIFY_USER, FETCH_USER, LOGOUT_USER } from "./types";
import { isOfType } from 'typesafe-actions'
import { setError } from "state/Error/action";
import { requestErrorStrategy, retryStrategy } from "state/strategies";

export const userFetchEpic: Epic<AllActions, AllActions, RootState, void> = (action$, state$)=>{
    return action$.pipe(
        filter(isOfType(FETCH_USER)),
        mergeMap((action)=>{
            // console.log("pre-noop")
            if(state$.value.user.userProfile) return of(noopUser())

            // console.log("mergemap: ", action)

            return ajax.getJSON('auth/user').pipe(
                map((response:any) =>{ 
                    // console.log("epic response: ", response)
                    setAuthToken(response.token)
                    return fetchSpotifyUserAction();
                })
                
            )
        }),
        catchError((error)=>{
                    // console.log(error);
                    return of(rejectUser(error))
        })
    )
}


const userLogoutEpic: Epic<AllActions,AllActions,RootState,void> = (action$,state$) =>{
    return action$.pipe(
        filter((action)=>action.type === LOGOUT_USER),
        mergeMap((action)=>{
            return ajax.get('/auth/logout').pipe(
                map((res)=>{
                    return noopAction();
                })
            )
        })
    )
}


const fetchSpotifyUserEpic: Epic<AllActions,AllActions, RootState, void> = (action$, state$)=>{

    return action$.pipe(
        filter((action)=>action.type === FETCH_SPOTIFY_USER),
        mergeMap((action)=>{
            return defer(()=> ajax.getJSON<SpotifyApi.UserObjectPrivate>('https://api.spotify.com/v1/me',{
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            })).pipe(
                map((response: SpotifyApi.UserObjectPrivate)=>{
                    console.log('user response: ', response)
                    if(response.product !== 'premium'){
                        return setError({msg: 'You need a spotify premuim account to use smptefy'})
                    }
                    return setUser(response)
                }),
                retryWhen(retryStrategy()),
                catchError(requestErrorStrategy())
            )
        })
    )


}

export const userEpic = combineEpics(userFetchEpic, userLogoutEpic, fetchSpotifyUserEpic)