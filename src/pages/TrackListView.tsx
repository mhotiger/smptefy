import { BoxProps } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from 'state';
import {
	clearTracks,
	fetchTracks,
	setTrackSourceId,
} from 'state/Tracks/actions';
import SpotifyLoader from 'components/common/SpotifyLoader';
import { Loading } from 'containers/Loading';
import TrackList from 'components/TrackList';

interface TrackListViewProps extends BoxProps {}

interface TrackIdParams {
	id: string;
}

export const TrackListView: React.FC<TrackListViewProps> = () => {
	const dispatch = useDispatch();

	const { id } = useParams<TrackIdParams>();

	useEffect(() => {
		dispatch(setTrackSourceId('playlists', id));
		dispatch(fetchTracks());

		return () => {
			dispatch(clearTracks());
		};
	}, [dispatch, id]);

	return (
		<SpotifyLoader
			path={`playlists/${id}/tracks`}
			render={(state) => {
				if (state.loading) {
					return <Loading />;
				} else if (state.data) {
					console.log('State track data: ', state.data);
					const tracks = state.data.items.map(
						(t: SpotifyApi.PlaylistTrackObject) => t.track
					);
					return <TrackList tracks={tracks} />;
				} else {
					return <div>nothing</div>;
				}
			}}></SpotifyLoader>
	);
};
