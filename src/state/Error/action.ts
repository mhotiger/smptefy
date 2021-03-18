import { AllActions } from 'state';
import { CLEAR_ERRORS, ErrorAction, ErrorMessage, SET_ERROR } from './types';

export const setError = (message: string, action?: AllActions): ErrorAction => {
	return {
		type: SET_ERROR,
		payload: { message, action },
	};
};

export const clearErrors = (): ErrorAction => {
	return {
		type: CLEAR_ERRORS,
	};
};
