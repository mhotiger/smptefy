export const FUNCTIONS_URL_BASE =(process.env.NODE_ENV === 'production')?
    'https://us-central1-smptefy.cloudfunctions.net' 
    :
    'http://localhost:5001/smptefy/us-central1'