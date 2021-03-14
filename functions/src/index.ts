import * as functions from "firebase-functions";
import express from 'express'
import cors from 'cors';
import SpotifyWebApi  from 'spotify-web-api-node'

const app = express();

const Spotify = new SpotifyWebApi({
  clientId: functions.config().spotify.client_id,
  clientSecret: functions.config().spotify.client_secret,
})

app.use(cors());




app.get('/helloworld', (req, res)=>{
  res.send('hello world\n');
  
});

app.get('/hellofresh',(req, res)=>{
  res.send(`proj: ${process.env.GCLOUD_PROJECT}`)
})

app.get('/', (req, res)=>{
  res.send("HOME PAGE")
})


exports.auth = functions.https.onRequest(app);