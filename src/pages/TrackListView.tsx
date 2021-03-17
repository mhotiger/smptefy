import {
	Box,
	BoxProps,
	Center,
	CircularProgress,
	Divider,
	Heading,
	Table,
	Tbody,
	Td,
	Th,
	Thead,
	Tr,
} from '@chakra-ui/react';
import { TCOffsetField } from 'components/TCOffsetField';
import { TrackCard } from 'containers/TrackCard';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { RootState } from 'state';
import {
	clearTracks,
	fetchTracks,
	setTrackSourceId,
} from 'state/Tracks/actions';
import { FiChevronRight } from 'react-icons/fi';
import { TCtime } from 'utils/Midi/types';
import { setTrackOffsetsAction } from 'state/Offsets/actions';
import { TrackOffsetState } from 'state/Offsets/types';
import { spotifyPlayTrackAction } from 'state/SpotifyWebPlayback/actions';
import { setMidiClockAction } from 'state/MidiPlayer/actions';

interface TrackListViewProps extends BoxProps {}

interface TrackIdParams {
	id: string;
}

export const TrackListView: React.FC<TrackListViewProps> = () => {
	const tracks = useSelector((state: RootState) => state.tracks.tracks);
	const offsets = useSelector((state: RootState) => state.offsets);
	const playlistSource = useSelector(
		(state: RootState) => state.tracks.playlistSource
	);
	const dispatch = useDispatch();

	const { id } = useParams<TrackIdParams>();

	useEffect(() => {
		dispatch(setTrackSourceId('playlists', id));
		dispatch(fetchTracks());

		return () => {
			dispatch(clearTracks());
		};
	}, [dispatch, id]);

	useEffect(() => {
		if (tracks.length > 0) {
			const offsetStarts: TrackOffsetState = tracks.reduce((a, t) => {
				return { ...a, [`${t.id}`]: { h: 0, m: 0, s: 0, f: 0 } };
			}, {});
			dispatch(setTrackOffsetsAction(offsetStarts));
		}
	}, [tracks, dispatch]);

	const handlePlay = (uri: string, id: string) => {
		if (offsets[`${id}`]) dispatch(setMidiClockAction(offsets[`${id}`]));
		else dispatch(setMidiClockAction({ h: 0, m: 0, s: 0, f: 0 }));
		dispatch(spotifyPlayTrackAction(uri));
	};

	const trackRows = tracks ? (
		tracks.map((t, i) => {
			return (
				<>
					<Tr
						key={t.id}
						_hover={{
							bg: 'gray.800',
						}}>
						<Td>{i + 1}</Td>
						<Td onClick={() => handlePlay(t.uri, t.id)}>
							<TrackCard track={t} />
						</Td>
						<Td onClick={() => handlePlay(t.uri, t.id)}>
							{t.album.name}
						</Td>
						<Td isNumeric>
							<TCOffsetField id={t.id} />
						</Td>
						<Td>
							<FiChevronRight />
						</Td>
					</Tr>
					<Tr>
						<Td colSpan={5}>
							<hr />
						</Td>
					</Tr>
				</>
			);
		})
	) : (
		<CircularProgress isIndeterminate></CircularProgress>
	);

	return (
		<>
			<Heading variant='md' m='0.8rem' ml='2rem'>
				{playlistSource?.name}
			</Heading>
			<Table variant='simple' size='sm'>
				<Thead>
					<Tr>
						<Th>#</Th>
						<Th>Title</Th>
						<Th>Album</Th>
						<Th isNumeric>Timecode Offset</Th>
						<Th></Th>
					</Tr>
				</Thead>
				<Tbody>{trackRows}</Tbody>
			</Table>
		</>
	);
};
