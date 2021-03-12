import { UserAction, FETCH_USER, SET_USER, UserProfile, LOGOUT_USER, FETCH_SPOTIFY_USER } from "./types";

export const fetchUser = (): UserAction =>{
    // console.log("fetchUser action")
    return {type: FETCH_USER}
}

export const setUser = (userPayload: SpotifyApi.UserObjectPrivate):UserAction =>{
    // console.log("setUser action", userPayload)
    return{
        type: SET_USER,
        userPayload
    }
}

export const rejectUser = (payload: any): UserAction => {
    // console.log("rejectUser action " , payload)
    return {
        type: 'USER_REJECTED',
        payload
    }
}


export const logoutUserAction = ():UserAction=>{
    return{
        type: LOGOUT_USER
    }   
}


export const noopUser = (): UserAction=>{
    // console.log("noop User action")
    return{
        type: 'NOOP_USER'
    }
}

export const fetchSpotifyUserAction = (): UserAction =>{
    return{
        type: FETCH_SPOTIFY_USER
    }
}
