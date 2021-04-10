import { Component } from 'react';
import { defer, Observable, Subscription } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, map, retryWhen, tap } from 'rxjs/operators';
import { requestErrorStrategy, retryStrategy } from 'state/strategies';
import { getAuthToken } from 'utils/auth';
import { connect, ConnectedProps } from 'react-redux';
import { setError } from 'state/Error/action';

const connector = connect(null, { setError });
type ReduxProps = ConnectedProps<typeof connector>;

interface State {
	loading: boolean;
	data?: any;
}

interface Props extends ReduxProps {
	render: (state: State) => React.ReactNode;
	path: string;
}

class SpotifyLoader extends Component<Props, State> {
	private sub?: Subscription;
	public state: State = {
		loading: false,
	};

	componentDidMount = () => {
		this.setState({ loading: true });
		console.log('component mount');
		this.sub = ajax
			.getJSON(`https://api.spotify.com/v1/${this.props.path}`, {
				Authorization: `Bearer ${getAuthToken()}`,
				'Content-Type': 'application/json',
			})
			.pipe(
				tap(() => console.log('ajax pipe')),
				retryWhen(retryStrategy()),
				catchError((err) => {
					console.log('Obs error: ', err);
					this.setState({ loading: false });
					this.props.setError(err.message);
					throw Error(err.message);
				})
			)
			.subscribe((response) => {
				console.log('send spotify req', response);
				this.setState({ data: response, loading: false });
			});
	};

	componentWillUnmount = () => {
		if (this.sub) this.sub.unsubscribe();
	};

	render() {
		return this.props.render(this.state);
	}
}

export default connect(null, { setError })(SpotifyLoader);
