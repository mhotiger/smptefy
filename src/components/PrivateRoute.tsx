import React from 'react';
import { useSelector } from 'react-redux';
import { isEmpty, isLoaded } from 'react-redux-firebase';
import { RootState } from 'state';
import { Route, Redirect, RouteProps } from 'react-router-dom';

interface PrivateRouteProps extends RouteProps {}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
	children,
	...rest
}) => {
	const auth = useSelector((state: RootState) => state.firebase.auth);
	return (
		<Route
			{...rest}
			render={({ location }) =>
				isLoaded(auth) && !isEmpty(auth) ? (
					children
				) : (
					<Redirect
						to={{
							pathname: '/login',
							state: { from: location },
						}}
					/>
				)
			}
		/>
	);
};
