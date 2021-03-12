export const FETCH_USER = 'FETCH_USER';
export const SET_USER = 'SET_USER';
export const USER_REJECTED = 'USER_REJECTED';
export const NOOP_USER = 'NOOP_USER';
export const LOGOUT_USER= 'LOGOUT_USER';
export const FETCH_SPOTIFY_USER = 'FETCH_SPOTIFY_USER';

export interface UserProfile {
    provider: string;
    id: string;
    username: string;
    displayName: string;
    profileUrl: string | null;
    photos: [string] | undefined;
    country: string;
    followers: number | null;
    product: string | null;
    emails?: [{ value: string; type: null }];
    _raw: string;
    _json: any;
}

export interface UserState{
    userProfile: SpotifyApi.UserObjectPrivate | undefined
}


export interface UserResponse{
    user: SpotifyApi.UserObjectPrivate
    token:TokenResponse
}
export interface TokenResponse{
    access_token: string
    expires_in: number
}



export interface FetchUserAction{
    type: typeof FETCH_USER
}

export interface SetUserAction{
    type: typeof SET_USER
    userPayload: SpotifyApi.UserObjectPrivate
}



export interface RejectedUserAction{
    type: typeof USER_REJECTED,
    payload?: any
}

export interface NoopUser{
    type: typeof NOOP_USER
}

export interface LogoutUserAction{
    type: typeof LOGOUT_USER
}

export interface FetchSpotifyUserAction{
    type: typeof FETCH_SPOTIFY_USER
}

export type UserAction = 
    FetchUserAction 
    | SetUserAction 
    | RejectedUserAction 
    | NoopUser
    | LogoutUserAction
    | FetchSpotifyUserAction

