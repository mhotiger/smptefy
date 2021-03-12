import { Box, Text} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'state'

interface TimecodeClockProps {

}

export const TimecodeClock: React.FC<TimecodeClockProps> = () => {
    
    const [time, setTime] = useState<string>()
    const timeStr$ = useSelector((state: RootState)=>state.midi.player.timeString$)

    useEffect(()=>{
        const sub = timeStr$.subscribe((time)=>{
            setTime(time);
        })

        return ()=>{
            sub.unsubscribe();
        }
    })

    return (
        <Box>
            <Text fontFamily='mono'>{time}</Text>
        </Box>
    )
}