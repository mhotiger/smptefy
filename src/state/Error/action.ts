import { CLEAR_ERRORS, ErrorAction, ErrorMessage, SET_ERROR } from "./types";

export const setError = (error: ErrorMessage): ErrorAction=>{
    return{
        type: SET_ERROR,
        payload: error
    }
}

export const clearErrors = (): ErrorAction =>{
    return{
        type: CLEAR_ERRORS
    }
}