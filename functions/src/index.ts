import * as functions from "firebase-functions";
import express from 'express'
import cors from 'cors'
import SpotifyWebApi  from 'spotify-web-api-node'
import cookieParser from 'cookie-parser'
import str from '@supercharge/strings'
import bodyParser from 'body-parser';


const app = express();

// const Spotify = new SpotifyWebApi({
//   clientId: functions.config().spotify!.client_id,
//   clientSecret: functions.config().spotify!.client_secret,
// })

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

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded());

app.get('/', (req, res)=>{
  res.send("HOME PAGE")
})

app.get('/redirect', (req,res)=>{
  const state:string = req.cookies.state || str.random(20);
  functions.logger.info("State verification: ", state);  
  res.cookie('state', state,{maxAge:3600000, secure: true, httpOnly:true});
  // const authorizeUrl = Spotify.createAuthorizeURL(OAUTH_SCOPES,state);
  // res.redirect(authorizeUrl);
  res.send(`config: ${JSON.stringify(functions.config().spotify)}`)
})

app.get('/token', (req, res)=>{
  const code = req.query.code;
  const state = req.query.state;
  res.send(`Code: ${code}\n State: ${state}`);

})


exports.auth = functions.https.onRequest(app);