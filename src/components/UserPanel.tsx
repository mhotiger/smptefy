import {
	Box,
	Button,
	Divider,
	Flex,
	Heading,
	Text,
	Image,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	AccordionItem,
	Spacer,
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
		<AccordionItem>
			<AccordionButton>
				<Flex direction='row' alignContent='center' alignItems='center'>
					<Image
						m='0.5rem'
						width='45px'
						height='45px'
						src={photo}
						borderRadius='100%'
					/>
					<Heading textAlign='right' p='0.5rem' size='sm'>
						{auth.displayName}
					</Heading>
					<Spacer />
					<AccordionIcon textAlign='right' />
				</Flex>
			</AccordionButton>
			<AccordionPanel>
				<Box m='2' pl='50%'>
					<Button align='right' onClick={() => firebase.logout()}>
						Logout
					</Button>
				</Box>
			</AccordionPanel>
		</AccordionItem>
	);
};
