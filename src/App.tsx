import * as React from 'react';
import { Box, ChakraProvider, theme } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'state';
import { fetchUser } from 'state/User/action';

import Layout from 'components/Layout';
import Login from 'components/Login';
import { ErrorMessages } from 'components/ErrorMessages';
import { setSpotifyReadyAction } from 'state/SpotifyWebPlayback/actions';
import { isLoaded, useFirebase, isEmpty } from 'react-redux-firebase';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Loading } from 'containers/Loading';
import { AuthComponent } from 'components/Auth';
import { PrivateRoute } from 'components/PrivateRoute';
import { midiTcPlayer } from 'utils/Midi/midiTcPlayer';
import ErrorBoundary from 'components/common/ErrorBoundary';

export const App = () => {
	const firebase = useFirebase();

	const auth = useSelector((state: RootState) => state.firebase.auth);
	const dispatch = useDispatch();

	window.onSpotifyWebPlaybackSDKReady = () => {
		console.log('spotify ready');
		dispatch(setSpotifyReadyAction(true));
	};

	return (
		<>
			<ErrorBoundary>
				<BrowserRouter>
					<Switch>
						<Route
							path='/loginauth'
							exact
							component={AuthComponent}></Route>
						<Route path='/login' exact>
							<Login />
						</Route>
						<PrivateRoute path='/'>
							<Layout />
						</PrivateRoute>
					</Switch>
				</BrowserRouter>
				<ErrorMessages />
			</ErrorBoundary>
		</>
	);
};
