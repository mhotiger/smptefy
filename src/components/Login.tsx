import { Box, BoxProps, Button, Flex } from '@chakra-ui/react';
import spotifyLogo from '../img/spotifyLogo.png';
import React from 'react';
import { FUNCTIONS_URL_BASE } from 'envconstants';

interface LoginProps extends BoxProps {}

export const Login: React.FC<LoginProps> = () => {
	console.log('hostname: ', window.location.hostname);
	console.log('location: ', `${FUNCTIONS_URL_BASE}/auth/redirect`);
	return (
		<Box
			position='fixed'
			top='50%'
			left='50%'
			transform='translate(-50%, -50%)'>
			<Flex direction='column' align='center'>
				<img src={spotifyLogo} alt='spotifyLogo' width='225px'></img>
				<Button
					borderRadius='2em'
					m='2em'
					p='1em'
					onClick={() =>
						window.location.assign(
							`${FUNCTIONS_URL_BASE}/auth/redirect`
						)
					}>
					log in with spotify
				</Button>
			</Flex>
		</Box>
	);
};

export default Login;
