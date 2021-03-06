import { Observable, of, throwError } from 'rxjs';
import { tap, mergeMap, finalize } from 'rxjs/operators';
import { getAuthToken, refresh } from 'utils/auth';
import { setError } from './Error/action';

export const requestErrorStrategy = () => (error: any) => {
	const message = error.response
		? error.response.error.message
		: error.message;
	console.log('Error strat: ', message);
	return of(setError(message));
};

export const retryStrategy = ({
	maxRetryAttempts = 3,
}: {
	maxRetryAttempts?: number;
} = {}) => (attempts: Observable<any>) => {
	return attempts.pipe(
		// tap((attempt) => {
		// 	console.log('retrying, trying to refresh the token', attempt);
		// }),
		mergeMap((error, i) => {
			if (!error.response) {
				console.log('no response');
				return throwError(error);
			}
			if (error.response.status && error.response.status !== 403) {
				return throwError(error);
			}
			const retryAttempt = i + 1;
			console.log('error: ', error);
			console.log('current auth token retry', getAuthToken());
			if (retryAttempt > maxRetryAttempts) {
				return throwError(error);
			}
			return refresh();
		})
	);
};
