"use client";
import {useEffect,useRef,useState} from "react";
import {api} from "./api-client";

declare global {interface Window {google?: {accounts:{id:{initialize:(config:Record<string,unknown>)=>void;renderButton:(el:HTMLElement,opts:Record<string,unknown>)=>void}}}}}
let googleLoader:Promise<void>|null=null;
function loadGoogle():Promise<void>{
 if(typeof window==="undefined")return Promise.reject(new Error("Browser required"));
 if(window.google?.accounts?.id)return Promise.resolve();
 if(googleLoader)return googleLoader;
 googleLoader=new Promise((resolve,reject)=>{
  const existing=document.querySelector<HTMLScriptElement>('script[data-medilink-google="yes"]');
  const script=existing||document.createElement("script");
  script.addEventListener("load",()=>resolve(),{once:true});
  script.addEventListener("error",()=>reject(new Error("Google login unavailable. Check your connection.")),{once:true});
  if(!existing){script.src="https://accounts.google.com/gsi/client";script.async=true;script.defer=true;script.dataset.medilinkGoogle="yes";document.head.appendChild(script);}
 });
 return googleLoader;
}
export default function GoogleLoginButton({admin=false,onSuccess}:{admin?:boolean;onSuccess:(user:{name:string;email:string;phone?:string;role:string})=>void}){
 const el=useRef<HTMLDivElement>(null),success=useRef(onSuccess);
 const [error,setError]=useState("");const [available,setAvailable]=useState(true);
 useEffect(()=>{success.current=onSuccess},[onSuccess]);
 useEffect(()=>{let alive=true;
  (async()=>{try{
   const cfg=await api<{clientId:string|null}>("/auth/google-config");
   if(!cfg.clientId){if(alive)setAvailable(false);return;}
   await loadGoogle();if(!alive||!el.current)return;
   window.google?.accounts.id.initialize({client_id:cfg.clientId,callback:async(result:{credential?:string})=>{
     if(!result.credential)return;
     try{const response=await api<{user:{name:string;email:string;phone?:string;role:string}}>("/auth/google",{method:"POST",body:JSON.stringify({credential:result.credential})});
      if(admin && response.user.role!=="admin")throw new Error("This Google account is not an approved administrator.");
      success.current(response.user);
     }catch(e){setError(e instanceof Error?e.message:"Google sign-in failed");}
   }});
   window.google?.accounts.id.renderButton(el.current,{theme:"outline",size:"large",shape:"rectangular",text:"signin_with",width:290});
  }catch(e){if(alive)setError(e instanceof Error?e.message:"Google login unavailable")}})();
  return()=>{alive=false};
 },[admin]);
 if(!available)return <p className="authHint">Google Sign-In needs GOOGLE_CLIENT_ID in backend/.env.</p>;
 return <div className="googleLoginWrap"><div ref={el}/>{error&&<p role="alert" className="formError">{error}</p>}</div>;
}
