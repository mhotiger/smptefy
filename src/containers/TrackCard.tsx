import { Flex, Heading, Spacer, Image, Text, Box} from '@chakra-ui/react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { spotifyPlayTrackAction } from 'state/SpotifyWebPlayback/actions'
import { StateTrackType } from 'state/Tracks/types'

interface TrackCardProps {
    track: StateTrackType
}

export const TrackCard: React.FC<TrackCardProps> = ({track}) => {
    const dispatch = useDispatch();
    
    return (
        <Flex   
            
            p='0px'  
            
            
            direction='row'
            align='center'
            role='group'
            
        >
            <Image 
                src={track.album.images[0].url} 
                width='65px' 
                height='65px'
                alt="playlistPhoto"
                >
            </Image>
            <Box >   
                <Heading size='sm' m='0.8rem'>{track.name.slice(0,45)}{track.name.length > 45 && '...'}</Heading>
                <Text m='0.8rem'>{track.artists[0].name}</Text>
            </Box>
        </Flex>
    )

}