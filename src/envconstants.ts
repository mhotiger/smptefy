export const FUNCTIONS_URL_BASE =
	window.location.hostname === 'localhost' ||
	window.location.hostname === '127.0.0.1'
		? 'https://us-central1-smptefy.cloudfunctions.net'
		: 'http://localhost:5001/smptefy/us-central1';
