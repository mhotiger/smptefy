import {
	Box,
	Button,
	Divider,
	Flex,
	Heading,
	Text,
	Image,
} from '@chakra-ui/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'state';
import { logoutUserAction } from 'state/User/action';
import defaultUser from 'img/defaultUser.png';
import { useFirebase, isLoaded, isEmpty } from 'react-redux-firebase';

interface UserPanelProps {}

export const UserPanel: React.FC<UserPanelProps> = ({}) => {
	const auth = useSelector((state: RootState) => state.firebase.auth);
	const dispatch = useDispatch();
	const firebase = useFirebase();

	let photo = defaultUser;
	if (isLoaded(auth) && !isEmpty(auth) && auth.photoURL) {
		photo = auth.photoURL;
	}

	return (
		<Box m='1rem'>
			<Flex direction='row'>
				<Image
					m='0.5rem'
					width='45px'
					height='45px'
					src={photo}
					borderRadius='100%'
				/>
				<Heading textAlign='right' p='0.5rem' size='md'>
					{auth.displayName}
				</Heading>
			</Flex>
			<Divider width='85%' />
			<Box m='2' pl='50%'>
				<Button align='right' onClick={() => firebase.logout()}>
					Logout
				</Button>
			</Box>
		</Box>
	);
};
