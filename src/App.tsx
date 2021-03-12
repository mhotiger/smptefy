import * as React from "react"
import {
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

export const App = () =>{

  const user = useSelector((state: RootState) => state.user.userProfile)
  const dispatch = useDispatch()


  window.onSpotifyWebPlaybackSDKReady = ()=>{
    console.log("spotify ready")
    dispatch(setSpotifyReadyAction(true))
  }

  React.useEffect(()=>{
    dispatch(initMidiAction())
    
  },[dispatch])

  if(!user){
    dispatch(fetchUser())
  }
  if(user){
    return (
      <ChakraProvider theme={theme}>
        <Layout/>
        <ErrorMessages/>
      </ChakraProvider>
    )
  }
  else{
    return(
    <ChakraProvider theme={theme}>
      <Login/>
      
    </ChakraProvider>
    )
  }
}
