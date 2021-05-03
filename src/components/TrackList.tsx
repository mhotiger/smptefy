import { Tr, Td, Heading, Thead, Table, Th, Tbody } from '@chakra-ui/react';
import { TrackCard } from 'containers/TrackCard';
import React, { useEffect } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'state';
import { setTrackOffsetsAction } from 'state/Offsets/actions';
import { TrackOffsetState } from 'state/Offsets/types';
import { spotifyPlayTrackAction } from 'state/SpotifyWebPlayback/actions';
import { TCOffsetField } from './TCOffsetField';
import _ from 'lodash';
import { midiTcPlayer } from 'utils/Midi/midiTcPlayer';
import { TCZeroTime } from 'utils/Midi/types';

interface TrackListProps {
	tracks: SpotifyApi.TrackObjectFull[];
}

const TrackList: React.FC<TrackListProps> = ({ tracks }) => {
	const dispatch = useDispatch();
	const offsets = useSelector((state: RootState) => state.offsets);
	const playlistSource = useSelector(
		(state: RootState) => state.tracks.playlistSource
	);

	useEffect(() => {
		if (tracks.length > 0) {
			const offsetStarts: TrackOffsetState = tracks.reduce((a, t) => {
				return { ...a, [`${t.id}`]: { h: 0, m: 0, s: 0, f: 0 } };
			}, {});
			dispatch(setTrackOffsetsAction(offsetStarts));
		}
	}, [tracks, dispatch]);

	const handlePlay = (uri: string, id: string) => {
		if (offsets[`${id}`]) {
			midiTcPlayer.setOffset(offsets[`${id}`]);
		} else {
			midiTcPlayer.setOffset(TCZeroTime);
		}
		dispatch(spotifyPlayTrackAction(uri));
	};

	const trackRows = tracks.map((t, i) => {
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
	});

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
						<Th isNumeric>Timecode Start</Th>
						<Th></Th>
					</Tr>
				</Thead>
				<Tbody>{trackRows}</Tbody>
			</Table>
		</>
	);
};

export default React.memo(TrackList, (prevProps, nextProps) => {
	return _.isEqual(prevProps, nextProps);
});
