import { Box, BoxProps, Flex, Spacer } from '@chakra-ui/react'
import React from 'react'
import { CurrentlyPlaying } from './CurrentlyPlaying'
import { PlayButton } from './PlayButton'
import { PlayerSlider } from './PlayerSlider'
import { TimecodeClock } from './TimecodeClock'

interface PlayerBarProps extends BoxProps {

}

export const PlayerBar: React.FC<PlayerBarProps> = (props) => {
    return (
        <Flex alignContent='center'>
           
            <CurrentlyPlaying/>
            <Flex p='1rem' align='center'>
                <PlayButton/>
            </Flex>
            <PlayerSlider/>
            <Flex p='1rem' align='center'>
                <TimecodeClock/>
            </Flex>
        </Flex>
    )
}