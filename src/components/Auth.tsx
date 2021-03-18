import { Loading } from 'containers/Loading';
import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import queryString from 'query-string';
import { Box } from '@chakra-ui/react';
import { useFirebase, isLoaded, isEmpty } from 'react-redux-firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setError } from 'state/Error/action';
import { setAuthToken, setRefreshToken } from 'utils/auth';
import { RootState } from 'state';
import { FUNCTIONS_URL_BASE } from 'envconstants';

interface AuthProps extends RouteComponentProps {}

export const AuthComponent: React.FC<AuthProps> = ({ location }) => {
	const [loading, setLoading] = useState(true);
	const auth = useSelector((state: RootState) => state.firebase.auth);
	const firebase = useFirebase();
	const dispatch = useDispatch();

	const code = queryString.parse(location.search).code;

	const fetchToken = async () => {
		const resp = await fetch(
			`${FUNCTIONS_URL_BASE}/auth/token?code=${code}`,
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
			dispatch(setError('Login error'));
		} else {
			setAuthToken(data.access_token);
			setRefreshToken(data.refresh_token);
			console.log('firebase: ,', firebase);
			await firebase.login({
				token: data.firebase_token,
				profile: data.profile,
			});
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchToken();
	}, []);

	if (!isLoaded(auth) || loading) {
		return <Loading />;
	} else if (!isEmpty(auth)) {
		return <Redirect to='/' />;
	} else {
		dispatch(setError('Authentication error'));
		return <Redirect to='/login' />;
	}
};
