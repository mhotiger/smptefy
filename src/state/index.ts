import { applyMiddleware, combineReducers, createStore } from 'redux';
import { combineEpics, createEpicMiddleware } from 'redux-observable';
import { userEpic } from './User/epic';
import { userReducer } from './User/reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import { UserAction } from './User/types';
import { PlaylistAction } from './Playlists/types';
import { playlistEpic } from './Playlists/epic';
import { playlistReducer } from './Playlists/reducer';
import { tracksReducer } from './Tracks/reducer';
import { TrackAction } from './Tracks/types';
import { ErrorAction } from './Error/types';
import { trackEpic } from './Tracks/epic';
import { errorReducer } from './Error/reducer';

import { spotifyPlayerReducer } from './SpotifyWebPlayback/reducer';
import { SpotifyPlayerAction } from './SpotifyWebPlayback/types';
import { spotifyEpic } from './SpotifyWebPlayback/epic';
import { trackOffsetReducer } from './Offsets/reducer';
import { firebaseReducer } from 'react-redux-firebase';

const rootReducer = combineReducers({
	user: userReducer,
	playlist: playlistReducer,
	tracks: tracksReducer,
	errors: errorReducer,
	// midi: midiPlayerReducer,
	spotify: spotifyPlayerReducer,
	offsets: trackOffsetReducer,
	firebase: firebaseReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const NOOP = 'NOOP';
export interface NoopAction {
	type: typeof NOOP;
}
export const noopAction = (): NoopAction => {
	return { type: NOOP };
};

interface GenericAction {
	type: string;
	payload?: any;
}

export type AllActions =
	| UserAction
	| PlaylistAction
	| TrackAction
	| ErrorAction
	| SpotifyPlayerAction
	| NoopAction
	| GenericAction;

const epicMiddleware = createEpicMiddleware<
	AllActions,
	AllActions,
	RootState,
	void
>();

const rootEpic = combineEpics(
	userEpic,
	playlistEpic,
	trackEpic,

	spotifyEpic
);

export const configureStore = () => {
	const store = createStore(
		rootReducer,
		composeWithDevTools(applyMiddleware(epicMiddleware))
	);
	epicMiddleware.run(rootEpic);
	return store;
};
