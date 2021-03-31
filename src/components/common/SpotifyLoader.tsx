import { Component } from 'react';
import { defer, Observable, Subscription } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, map, retryWhen } from 'rxjs/operators';
import { requestErrorStrategy, retryStrategy } from 'state/strategies';
import { getAuthToken } from 'utils/auth';

interface State {
	loading: boolean;
	data?: any;
}

interface Props {
	render: (state: State) => React.ReactNode;
	path: string;
}

export class SpotifyLoader extends Component<Props, State> {
	private sub?: Subscription;
	public state: State = {
		loading: false,
	};

	componentDidMount = () => {
		this.setState({ loading: true });
		this.sub = defer(() => {
			ajax.getJSON(`https://api.spotify.com/v1/${this.props.path}`, {
				Authorization: `Bearer ${getAuthToken()}`,
				'Content-Type': 'application/json',
			}).pipe(
				retryWhen(retryStrategy()),
				catchError(requestErrorStrategy())
			);
		}).subscribe((response) => {
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
