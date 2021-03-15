import { Loading } from 'containers/Loading';
import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import queryString from 'query-string';
import { Box } from '@chakra-ui/react';

interface AuthProps extends RouteComponentProps {}

export const AuthComponent: React.FC<AuthProps> = ({ location }) => {
	const [loading, setLoading] = useState(true);
	console.log('auth component');
	const code = queryString.parse(location.search).code;
	console.log('code: ', code);
	const fetchToken = async () => {
		const resp = await fetch(
			`http://localhost:5001/smptefy/us-central1/auth/token?code=${code}`,
			{
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		const data = await resp.json();
		console.log('token response: ', data);
	};

	useEffect(() => {
		fetchToken();
	}, []);

	return <Box>loading...</Box>;
};
