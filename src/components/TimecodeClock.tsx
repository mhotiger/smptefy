import { Box, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { midiTcPlayer, timeToString } from 'utils/Midi/midiTcPlayer';

interface TimecodeClockProps {}

export const TimecodeClock: React.FC<TimecodeClockProps> = () => {
	const [time, setTime] = useState<string>();

	useEffect(() => {
		const sub = midiTcPlayer.time$.subscribe((time) => {
			setTime(timeToString(time));
		});

		return () => {
			sub.unsubscribe();
		};
	});

	return (
		<Box>
			<Text fontFamily='mono'>{time}</Text>
		</Box>
	);
};
