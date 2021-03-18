import { Epic } from 'redux-observable';
import { filter, mergeMap, retryWhen, catchError, map } from 'rxjs/operators';
import { AllActions, RootState } from 'state';
import { FETCH_PLAYLISTS } from './types';
import { isOfType } from 'typesafe-actions';
import { getAuthToken } from 'utils/auth';
import { ajax } from 'rxjs/ajax';
import { addPlaylists } from './action';
import { requestErrorStrategy, retryStrategy } from 'state/strategies';
import { defer } from 'rxjs';

export const playlistEpic: Epic<AllActions, AllActions, RootState, void> = (
	action$
) => {
	return action$.pipe(
		filter(isOfType(FETCH_PLAYLISTS)),
		mergeMap(() => {
			return defer(() =>
				ajax.getJSON(
					'https://api.spotify.com/v1/me/playlists?limit=50',
					{
						Authorization: `Bearer ${getAuthToken()}`,
						'Content-Type': 'application/json',
					}
				)
			).pipe(
				map((response: any) => {
					return addPlaylists(response.items);
				}),
				retryWhen(retryStrategy()),
				catchError(requestErrorStrategy())
			);
		}),
		catchError(requestErrorStrategy())
	);
};
