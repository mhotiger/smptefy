import { TokenResponse } from "state/User/types";


let authToken = "";
// let needsRefresh = false;
// let refreshTimeout: NodeJS.Timeout;
let timeForRefresh: number;


export const  getAuthToken =  () =>{
    // if(Date.now() > timeForRefresh){

    //     //refresh the token
    //     await refresh();
    //     return authToken;
    // }
    return authToken;
}

export const setAuthToken = (tkData: TokenResponse) =>{
    if(tkData.access_token){
        
        authToken = tkData.access_token;
        
    } 
        
    else{
        authToken = "";
    }
}

export const refresh = async()=>{
    const resp = await fetch('/auth/refresh');
    const data = await resp.json()
    console.log("refresh:", data);
    
    if(data.access_token){
        authToken = data.access_token;
        // needsRefresh = false;
        timeForRefresh = Date.now() + data.expires_in;
        return
        
    }else if(data.error){
        throw new Error('Error Getting refresh token')
    }
}

