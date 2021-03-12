import { CLEAR_ERRORS, ErrorAction, ErrorState, SET_ERROR } from "./types";

const initialState: ErrorState = {
    errors: []
}

export const errorReducer = (state: ErrorState = initialState, action: ErrorAction): ErrorState =>{
    switch(action.type){
        case SET_ERROR:
            const newErrors = [...state.errors];
            newErrors.push(action.payload)
            return {
                errors: newErrors
            }
        case CLEAR_ERRORS:
            return initialState
        default:
            return state
    }
}