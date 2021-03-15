import { Loading } from 'containers/Loading';
import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router';
import queryString from 'query-string';
import { repeatWhen } from 'rxjs/operators';

interface AuthProps extends RouteComponentProps {}

export const Auth: React.FC<AuthProps> = ({ location }) => {
	const [loading, setLoading] = useState(true);

	const code = queryString.parse(location.search).code;

	const fetchToken = async () => {
		const resp = await fetch(
			`localhost:5000/smptefy/auth/token?code=${code}`,
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
		//fetch token
	}, []);

	return loading ? <Loading /> : <Redirect to='/'></Redirect>;
};
