import {
	INIT_SPOTIFY,
	PlaybackState,
	SET_SPOTIFY_DEVICE_ID,
	SET_SPOTIFY_PLAYBACK_STATE,
	SET_SPOTIFY_READY,
	SpotifyPlayerAction,
	SpotifyPlayerState,
	SPOTIFY_PLAYBACK_READY,
	SPOTIFY_SEEK,
} from './types';
import produce from 'immer';
import { getAuthToken } from 'utils/auth';
import { setError } from 'state/Error/action';
import {
	setSpotifyDeviceIdAction,
	spotifyPlaybackReadyAction,
	spotifyStateChangedAction,
} from './actions';
// import { playMidiAction } from 'state/MidiPlayer/actions';
import { BehaviorSubject, Subject } from 'rxjs';
import { midiTcPlayer } from 'utils/Midi/midiTcPlayer';

const initialState: SpotifyPlayerState = {
	isReadyToInit: false,
	isReady: false,
	playbackPos$: new BehaviorSubject<number>(0),
	paused$: new BehaviorSubject<boolean>(true),
};

export const spotifyPlayerReducer = produce(
	(
		state: SpotifyPlayerState,
		action: SpotifyPlayerAction
	): SpotifyPlayerState => {
		switch (action.type) {
			case SET_SPOTIFY_READY:
				state.isReadyToInit = action.isReady;
				return state;

			case INIT_SPOTIFY:
				state.player = new Spotify.Player({
					name: 'Smptefy',
					getOAuthToken: (cb) => {
						cb(getAuthToken());
					},
				});

				state.player.addListener('initialization_error', () => {
					action.dispatch(
						setError('Error initializing spotify player')
					);
				});
				state.player.addListener(
					'authentication_error',
					({ message }) => {
						console.error(message);
						action.dispatch(setError(message));
					}
				);
				state.player.addListener('account_error', ({ message }) => {
					action.dispatch(setError(message));
				});
				state.player.addListener('playback_error', ({ message }) => {
					action.dispatch(setError(message));
				});

				// Playback status updates
				state.player.addListener(
					'player_state_changed',
					(player_state) => {
						//action.dispatch(setError({msg: `Playback State Changed`}))
						action.dispatch(
							spotifyStateChangedAction({
								...player_state,
							} as PlaybackState)
						);
					}
				);

				// Ready
				state.player.addListener('ready', ({ device_id }) => {
					console.log('Ready with Device ID', device_id);
					action.dispatch(setSpotifyDeviceIdAction(device_id));
					action.dispatch(spotifyPlaybackReadyAction(true));
				});

				// Not Ready
				state.player.addListener('not_ready', ({ device_id }) => {
					action.dispatch(setError(`Device ${device_id} is offline`));

					action.dispatch(setSpotifyDeviceIdAction(undefined));
					action.dispatch(spotifyPlaybackReadyAction(false));
					console.log('Device ID has gone offline', device_id);
				});

				state.player.connect();

				return state;

			case SET_SPOTIFY_DEVICE_ID:
				state.device_id = action.device_id;
				return state;

			case SPOTIFY_PLAYBACK_READY:
				state.isReady = action.isReady;
				return state;

			case SET_SPOTIFY_PLAYBACK_STATE:
				state.playbackState = action.playbackState;
				return state;

			case SPOTIFY_SEEK:
				if (state.playbackState && state.player) {
					if (state.playbackState.disallows['seeking']) {
						return state;
					} else if (
						action.time >= 0 &&
						action.time < state.playbackState.duration
					) {
						state.playbackState.position = action.time;
						return state;
					}
				}
				return state;

			default:
				return state;
		}
	},
	initialState
);
