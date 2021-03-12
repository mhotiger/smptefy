
export const SET_ERROR = 'SET_ERROR'
export const CLEAR_ERRORS = 'CLEAR_ERRORS'

export interface ErrorMessage{
    msg: string
}
export interface ErrorState{
    errors: ErrorMessage[]
}

export interface SetErrorAction {
    type: typeof SET_ERROR
    payload: ErrorMessage
}

export interface ClearErrorAction{
    type: typeof CLEAR_ERRORS
}

export type ErrorAction = SetErrorAction | ClearErrorAction