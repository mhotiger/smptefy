import {
	Text,
	AlertDialog,
	AlertDialogOverlay,
	AlertDialogContent,
	AlertDialogHeader,
	AlertDialogBody,
	AlertDialogFooter,
	Button,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'state';
import { clearErrors } from 'state/Error/action';

interface ErrorMessagesProps {}

export const ErrorMessages: React.FC<ErrorMessagesProps> = () => {
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useDispatch();

	const cancelRef = useRef(null);

	const errors = useSelector((state: RootState) => state.errors.errors);

	const onClose = () => {
		errorResponseButtons.current = undefined;
		setIsOpen(false);
		dispatch(clearErrors());
	};

	let error = errors[0];
	let errorResponseButtons = useRef<
		JSX.Element | JSX.Element[] | undefined
	>();

	if (errors.length > 0 && !isOpen) {
		console.log(errors);
		if (errors[0].action) {
			errorResponseButtons.current = errors[0].action.map((a, i) => {
				if (i === 0) {
					return (
						<Button
							m='0.3rem'
							ref={cancelRef}
							key={`${a.message}-${i}`}
							onClick={() => {
								dispatch(a.action);
								onClose();
							}}>
							{a.message}
						</Button>
					);
				} else {
					return (
						<Button
							m='0.3rem'
							key={`${a.message}-${i}`}
							onClick={() => {
								dispatch(a.action);
								onClose();
							}}>
							{a.message}
						</Button>
					);
				}
			});
		} else {
			errorResponseButtons.current = (
				<Button m='0.3rem' ref={cancelRef} onClick={onClose}>
					Ok
				</Button>
			);
		}
		console.log(errorResponseButtons);
		setIsOpen(true);
	}
	console.log('errorButtons', errorResponseButtons);
	return (
		<AlertDialog
			isOpen={isOpen}
			leastDestructiveRef={cancelRef}
			onClose={onClose}>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize='lg' fontWeight='bold'>
						Error
					</AlertDialogHeader>

					<AlertDialogBody>
						<Text>{error?.message}</Text>
					</AlertDialogBody>

					<AlertDialogFooter>
						{errorResponseButtons.current}
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
};
