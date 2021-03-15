import * as React from 'react';
import { Box, ChakraProvider, theme } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'state';
import { fetchUser } from 'state/User/action';

import Layout from 'components/Layout';
import Login from 'components/Login';
import { ErrorMessages } from 'components/ErrorMessages';
import { initMidiAction } from 'state/MidiPlayer/actions';
import { setSpotifyReadyAction } from 'state/SpotifyWebPlayback/actions';
import { isLoaded, useFirebase, isEmpty } from 'react-redux-firebase';
import { BrowserRouter, Route } from 'react-router-dom';
import { Loading } from 'containers/Loading';
import { AuthComponent } from 'components/Auth';

export const App = () => {
	const firebase = useFirebase();

	const auth = useSelector((state: RootState) => state.firebase.auth);
	const dispatch = useDispatch();

	window.onSpotifyWebPlaybackSDKReady = () => {
		console.log('spotify ready');
		dispatch(setSpotifyReadyAction(true));
	};

	React.useEffect(() => {
		dispatch(initMidiAction());
	}, [dispatch]);

	return (
		<BrowserRouter>
			<Route path='/loginauth' component={AuthComponent}></Route>
			<Route path='/play' component={Layout} />
			<Route path='/' component={Login}></Route>
		</BrowserRouter>
	);
};
