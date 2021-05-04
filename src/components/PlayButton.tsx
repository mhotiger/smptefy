import { Button } from '@chakra-ui/react';
import React from 'react';
import { FiPlay, FiPause } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'state';
import {
	spotifyPauseAction,
	spotifyPlayAction,
	spotifyTogglePlaybackAction,
} from 'state/SpotifyWebPlayback/actions';
interface PlayButtonProps {}

export const PlayButton: React.FC<PlayButtonProps> = (props) => {
	const playState = useSelector(
		(state: RootState) => state.spotify.playbackState
	);
	const dispatch = useDispatch();

	let icon;
	if (playState) {
		icon = playState.paused ? <FiPlay /> : <FiPause />;
	} else {
		icon = <FiPlay />;
	}

	const togglePlay = () => {
		if (playState) {
			if (playState.paused) {
				dispatch(spotifyPlayAction());
			} else {
				dispatch(spotifyPauseAction());
			}
		}
	};

	return (
		<Button m='1rem' p='0.5rem' onClick={() => togglePlay()}>
			{icon}
		</Button>
	);
};
