import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from './state';
import { App } from './App';
import firebase from 'firebase/app';

import { firebaseConfig } from './firebase';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
require('firebase/auth');
require('firebase/database');
require('firebase/functions');
export const app = firebase.initializeApp(firebaseConfig);

if (
	window.location.hostname === 'localhost' ||
	window.location.hostname === '127.0.0.1'
) {
	const auth = firebase.auth();
	const db = firebase.database();
	auth.useEmulator('http://localhost:9099');
	db.useEmulator('localhost', 9002);
}

const rrfConfig = {
	userProfile: 'users',
	updateProfileOnLogin: false,
	// useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

const store = configureStore();

const theme = extendTheme({
	config: {
		initialColorMode: 'dark',
		useSystemColorMode: false,
	},
});

const rrfProps = {
	firebase,
	config: rrfConfig,
	dispatch: store.dispatch,
	// createFirestoreInstance // <- needed if using firestore
};

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<ReactReduxFirebaseProvider {...rrfProps}>
				<ChakraProvider theme={theme}>
					<ColorModeScript initialColorMode='dark' />
					<App />
				</ChakraProvider>
			</ReactReduxFirebaseProvider>
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorker.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
