import { Flex } from '@chakra-ui/react';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { setError } from 'state/Error/action';

const connector = connect(null, { setError });
type ReduxProps = ConnectedProps<typeof connector>;

interface Props extends ReduxProps {
	children: ReactNode;
}

interface State {
	hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
	public state: State = {
		hasError: false,
	};

	public static getDerivedStateFromError(_: Error): State {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error('Uncaught error:', error, errorInfo);

		this.props.setError(`${error.message}`);
	}

	public render() {
		if (this.state.hasError) {
			return (
				<Flex
					bg='gray.900'
					p='0.8rem'
					m='1rem'
					h='80px'
					borderRadius='10px'
					boxShadow='md'
					direction='row'
					align='center'>
					An error occured
				</Flex>
			);
		}

		return this.props.children;
	}
}

export default connect(null, { setError })(ErrorBoundary);
