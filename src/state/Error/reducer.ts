import { CLEAR_ERRORS, ErrorAction, ErrorState, SET_ERROR } from './types';
import produce from 'immer';
const initialState: ErrorState = {
	errors: [],
};

export const errorReducer = produce(
	(state: ErrorState = initialState, action: ErrorAction): ErrorState => {
		switch (action.type) {
			case SET_ERROR:
				state.errors.push(action.payload);
				return state;
			case CLEAR_ERRORS:
				state.errors.shift();
				return state;
			default:
				return state;
		}
	},
	initialState
);
