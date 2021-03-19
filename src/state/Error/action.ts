import {
	CLEAR_ERRORS,
	ErrorAction,
	ErrorResponseUserAction,
	SET_ERROR,
} from './types';

export const setError = (
	message: string,
	action?: ErrorResponseUserAction[]
): ErrorAction => {
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
