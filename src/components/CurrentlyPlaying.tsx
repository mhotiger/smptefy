import { Box, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { current } from 'immer';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'state';

interface CurrentlyPlayingProps {}

export const CurrentlyPlaying: React.FC<CurrentlyPlayingProps> = () => {
	const currentTrack = useSelector(
		(state: RootState) =>
			state.spotify.playbackState?.track_window?.current_track
	);

	return currentTrack ? (
		<Flex direction='row' p='0.8rem' m='1rem'>
			<Image
				src={currentTrack.album.images[0].url}
				alt='Current track album cover'
				width='4.5rem'
				height='4.5rem'
			/>
			<Flex
				align='center'
				m='0.3rem'
				p='1.5rem'
				width='full'
				direction='column'>
				<Heading size='sm'>{currentTrack.name} </Heading>
				<Text size='sm'>{currentTrack.artists[0].name}</Text>
			</Flex>
		</Flex>
	) : (
		<Box></Box>
	);
};
