import { ColorModeScript } from '@chakra-ui/react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from './state';
import { App } from './App';
import firebase from 'firebase/app';
import { firebaseConfig } from './firebase';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';

const app = firebase.initializeApp(firebaseConfig);

const rrfConfig = {
	userProfile: 'users',
	// useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

const store = configureStore();

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
				<ColorModeScript initialColorMode='dark' />
				<App />
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
