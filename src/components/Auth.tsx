import { Loading } from 'containers/Loading';
import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import queryString from 'query-string';
import { Box } from '@chakra-ui/react';
import { useFirebase } from 'react-redux-firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setError } from 'state/Error/action';
import { setAuthToken } from 'utils/auth';
import { RootState } from 'state';

interface AuthProps extends RouteComponentProps {}

export const AuthComponent: React.FC<AuthProps> = ({ location }) => {
	const [loading, setLoading] = useState(true);
	const auth = useSelector((state: RootState) => state.firebase.auth);
	const firebase = useFirebase();
	const dispatch = useDispatch();

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
		if (data.error) {
			dispatch(setError({ msg: 'Login error' }));
		} else {
			setAuthToken(data.access_token);
			console.log('firebase: ,', firebase);
			firebase.login({
				token: data.firebase_token,
				profile: data.profile,
			});
			// firebase.auth().signInWithCustomToken(data.firebase_token);
		}
	};

	useEffect(() => {
		fetchToken();
	}, []);

	return <Box>loading...</Box>;
};
