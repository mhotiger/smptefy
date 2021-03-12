import { LOGOUT_USER, UserAction, UserState } from "./types";



const initialState: UserState = {
    userProfile: undefined
}

export const userReducer = (state = initialState, action: UserAction):UserState =>{
    switch(action.type){
        case 'SET_USER':
            // console.log("setUser reducer: ", action)
            if(action.userPayload)return {userProfile: action.userPayload}
            return initialState
        case 'USER_REJECTED':
            // console.log("rejectUser reducer: ", action)
            return initialState
        case LOGOUT_USER:
            return initialState
        default:
            return state;
    }
}