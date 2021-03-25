import { Accordion, Grid, GridItem } from '@chakra-ui/react';
import PlaylistView from 'pages/PlaylistView';
import { TrackListView } from 'pages/TrackListView';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	BrowserRouter as Router,
	Route,
	Switch,
	useRouteMatch,
} from 'react-router-dom';
import { RootState } from 'state';
import { initSpotifyAction } from 'state/SpotifyWebPlayback/actions';
import ErrorBoundary from './common/ErrorBoundary';
import { MidiSettingsPanel } from './MidiSettingsPanel';
import { PlayerBar } from './PlayerBar';
import { PrivateRoute } from './PrivateRoute';
import { UserPanel } from './UserPanel';

interface LayoutProps {}

export const Layout: React.FC<LayoutProps> = () => {
	const spotify = useSelector((state: RootState) => state.spotify);
	const dispatch = useDispatch();
	const { path, url } = useRouteMatch();

	if (spotify.isReadyToInit && !spotify.player) {
		console.log('setting up spotify');
		dispatch(initSpotifyAction(dispatch));
	}

	return (
		<Grid
			h='100vh'
			templateColumns='repeat(5,1fr)'
			templateRows='repeat(10,1fr)'>
			<GridItem colSpan={1} rowSpan={8} bg='gray.900'>
				<ErrorBoundary>
					<Accordion allowMultiple>
						<UserPanel />
						<MidiSettingsPanel />
					</Accordion>
				</ErrorBoundary>
			</GridItem>

			<GridItem
				colSpan={4}
				rowSpan={8}
				bg='gray.700'
				overflowY='auto'
				css={{
					'&::-webkit-scrollbar': {
						width: '0.25rem',
					},
					'&::-webkit-scrollbar-track': {
						background: '#1e1e24',
					},
					'&::-webkit-scrollbar-thumb': {
						background: '#888',
						borderRadius: '0.5rem',
					},
				}}>
				<ErrorBoundary>
					<Switch>
						<PrivateRoute path={path} exact>
							<PlaylistView />
						</PrivateRoute>
						<PrivateRoute path={`${path}playlist/:id`}>
							<TrackListView />
						</PrivateRoute>
					</Switch>
				</ErrorBoundary>
			</GridItem>
			<GridItem rowSpan={2} colSpan={8} bg='gray.800' zIndex={10}>
				<ErrorBoundary>
					<PlayerBar />
				</ErrorBoundary>
			</GridItem>
		</Grid>
	);
};

export default Layout;
