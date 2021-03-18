import { BoxProps, Flex, Heading, Spacer, Image, Text } from '@chakra-ui/react';
import React from 'react';
import defaultCover from 'img/defaultCover.png';

interface PlaylistCardProps extends BoxProps {
	playlistItem: SpotifyApi.PlaylistObjectFull;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = (props) => {
	return (
		<Flex
			bg='gray.900'
			p='0px'
			m='1rem'
			borderRadius='10px'
			boxShadow='md'
			direction='row'
			align='center'
			role='group'
			_hover={{
				bg: 'gray.800',
			}}>
			<Image
				src={
					props.playlistItem.images[0]
						? props.playlistItem.images[0].url
						: defaultCover
				}
				width='100px'
				height='100px'
				alt='playlistPhoto'
				borderRadius='10px 0 0 10px'></Image>
			<Heading size='md' m='0.8rem'>
				{props.playlistItem.name.slice(0, 45)}
				{props.playlistItem.name.length > 45 && '...'}
			</Heading>
			<Spacer></Spacer>
			<Text m='0.8rem'>{props.playlistItem.tracks.total} tracks</Text>
		</Flex>
	);
};

export default PlaylistCard;
