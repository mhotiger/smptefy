import { Center } from '@chakra-ui/react';
import ErrorBoundary from 'components/common/ErrorBoundary';
import PlaylistCard from 'containers/PlaylistCard';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from 'state';
import { fetchPlaylists } from 'state/Playlists/action';
import { setPlaylistSourceAction } from 'state/Tracks/actions';

interface PlaylistViewProps {}

export const PlaylistView: React.FC<PlaylistViewProps> = () => {
	const playlists = useSelector(
		(state: RootState) => state.playlist.playlists
	);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchPlaylists());
	}, [dispatch]);

	if (playlists.length !== 0) {
		const list = playlists.map((p) => {
			return (
				<ErrorBoundary key={p.id}>
					<Link
						onClick={() => dispatch(setPlaylistSourceAction(p))}
						key={p.id}
						to={'/playlist/' + p.id}>
						<PlaylistCard playlistItem={p} />
					</Link>
				</ErrorBoundary>
			);
		});
		return <>{list}</>;
	} else {
		return <Center> Loading </Center>;
	}
};

export default PlaylistView;
