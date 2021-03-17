import * as functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import SpotifyWebApi from 'spotify-web-api-node';
import cookieParser from 'cookie-parser';
import str from '@supercharge/strings';

import admin from 'firebase-admin';
import serviceAccount from './smptefy-firebase-adminsdk-4bpl5-164b310110.json';

const params = {
	type: serviceAccount.type,
	projectId: serviceAccount.project_id,
	privateKeyId: serviceAccount.private_key_id,
	privateKey: serviceAccount.private_key,
	clientEmail: serviceAccount.client_email,
	clientId: serviceAccount.client_id,
	authUri: serviceAccount.auth_uri,
	tokenUri: serviceAccount.token_uri,
	authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
	clientC509CertUrl: serviceAccount.client_x509_cert_url,
};

admin.initializeApp({
	credential: admin.credential.cert(params),
	databaseURL: `https://smptefy.firebaseio.com`,
});

const app = express();

const Spotify = new SpotifyWebApi({
	clientId: functions.config().spotify!.client_id,
	clientSecret: functions.config().spotify!.client_secret,
	redirectUri:
		functions.config().env.prod === 'true'
			? `https://smptefy.web.app/loginauth`
			: `http://localhost:5000/loginauth`,
});

const OAUTH_SCOPES = [
	'user-read-email',
	'user-read-private',
	'streaming',
	'playlist-read-private',
	'playlist-read-collaborative',

	'user-read-playback-state',
	'user-modify-playback-state',
	'user-read-currently-playing',
	'user-read-playback-position',
];

app.use(
	cors({
		origin: [
			'http://localhost:3000',
			'http://localhost:5000',
			'https://smptefy.com',
			'https://smptefy.web.app',
		],
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
	res.send(`prod: ${functions.config().env.prod}`);
});

app.get('/redirect', (req, res) => {
	const state: string = req.cookies.state || str.random(20);
	res.cookie('state', state, {
		maxAge: 3600000,
		secure: true,
		httpOnly: true,
		sameSite: 'lax',
	});
	const authorizeUrl = Spotify.createAuthorizeURL(OAUTH_SCOPES, state, true);
	res.redirect(authorizeUrl);
});

app.get('/token', async (req, res) => {
	try {
		Spotify.authorizationCodeGrant(
			req.query.code as string,
			(error, data) => {
				if (error) {
					throw error;
				}
				Spotify.setAccessToken(data.body.access_token);
				Spotify.setRefreshToken(data.body.refresh_token);
				Spotify.getMe(async (error, userResult) => {
					if (error) {
						throw error;
					}
					const { id, display_name, email } = userResult.body;
					const profile_pic = userResult.body.images
						? userResult.body.images[0].url
						: undefined;
					const firebase_token = await createFirebaseAccount(
						id,
						display_name!,
						profile_pic!,
						email,
						data.body.access_token
					);

					res.json({
						firebase_token,
						access_token: data.body.access_token,
						refresh_token: data.body.refresh_token,
						profile: {
							email,
							displayName: display_name,
							id: `spotify:${id}`,
							photoURL: profile_pic,
						},
					});
				});
			}
		);
	} catch (err) {
		res.json({ error: err.message });
	}
});

app.post('/refresh', async (req, res) => {
	const refresh_token = req.body;
	console.log('Refresh Token: ', req.body);
	Spotify.setRefreshToken(refresh_token);
	Spotify.refreshAccessToken()
		.then((data) => {
			console.log(data);
			res.json(data.body);
		})
		.catch((err) => {
			functions.logger.error('Refresh error:', err);
			res.status(401).json(err);
		});
});

const createFirebaseAccount = async (
	spotify_id: string,
	display_name: string,
	profile_image: string,
	email: string,
	access_token: string
): Promise<string> => {
	const uid = `spotify:${spotify_id}`;
	const databaseWrite = admin
		.database()
		.ref(`/spotifyAccessToken/${uid}`)
		.set(access_token);
	const userCreate = admin
		.auth()
		.updateUser(uid, {
			displayName: display_name,
			photoURL: profile_image,
			email: email,
			emailVerified: true,
		})
		.catch((err) => {
			console.log('Update user failed');
			if (err.code === 'auth/user-not-found') {
				return admin.auth().createUser({
					uid: uid,
					displayName: display_name,
					photoURL: profile_image,
					email: email,
					emailVerified: true,
				});
			}
			throw err;
		});

	await Promise.all([userCreate, databaseWrite]).catch((err) => {
		throw err;
	});
	const firebaseToken = await admin.auth().createCustomToken(uid);
	console.log('firebaseToken: ', firebaseToken);
	return firebaseToken;
};

exports.auth = functions.https.onRequest(app);
