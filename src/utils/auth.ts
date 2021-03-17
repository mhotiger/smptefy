import { FUNCTIONS_URL_BASE } from "envconstants";



let auth_token = "";
let refresh_token = "";



export const  getAuthToken =  ():string =>{

    return auth_token;
}

export const getRefreshToken = (): string=>{
    return refresh_token
}

export const setAuthToken = (token: string) =>{
    auth_token = (token)? token: "";
}

export const setRefreshToken = (token:string)=>{
    refresh_token = (token)?token: "";
}

export const refresh = async()=>{
    const resp = await fetch(`${FUNCTIONS_URL_BASE}/smptefy/us-central1/auth/refresh`,{
        body: refresh_token,
        method:"POST"
    });
    const data = await resp.json()
    console.log("refresh:", data);
    
    if(data.access_token){
        auth_token = data.access_token;
        
        return
        
    }else if(data.error){
        throw new Error('Error Getting refresh token')
    }
}

