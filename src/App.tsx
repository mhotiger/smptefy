import * as React from "react"
import {
  Box,
  ChakraProvider,
  theme,
} from "@chakra-ui/react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "state"
import { fetchUser } from "state/User/action"

import Layout from "components/Layout"
import Login from "components/Login"
import { ErrorMessages } from "components/ErrorMessages"
import { initMidiAction } from "state/MidiPlayer/actions"
import { setSpotifyReadyAction } from "state/SpotifyWebPlayback/actions"
import { isLoaded, useFirebase, isEmpty } from "react-redux-firebase"
import {BrowserRouter, Route} from 'react-router-dom';
import { Loading } from "containers/Loading"
import { Auth } from "components/Auth"


export const App = () =>{

  const firebase = useFirebase();
  
  const auth = useSelector((state: RootState) => state.firebase.auth)
  const dispatch = useDispatch()

  window.onSpotifyWebPlaybackSDKReady = ()=>{
    console.log("spotify ready")
    dispatch(setSpotifyReadyAction(true))
  }

  React.useEffect(()=>{
    dispatch(initMidiAction())
    
  },[dispatch])


  var rootComponent;
  //loading user
  if(!isLoaded(auth)){
    rootComponent = Loading
  }else if(!isEmpty(auth)){

    rootComponent = Layout 

  }else{
    rootComponent = Login
  }

  return(
    <BrowserRouter>
      <Route path='/' component={rootComponent}></Route>
      <Route path='/auth' component={Auth}></Route>
    </BrowserRouter>
  )
}
