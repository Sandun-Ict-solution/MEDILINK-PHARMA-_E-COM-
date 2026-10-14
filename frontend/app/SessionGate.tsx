"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { api } from "./api-client";
import FloatingHealthBot from "./FloatingHealthBot";

type User = { id:string; name:string; email:string; emailVerified:boolean; role:string };
const isAdminPath = (p:string) => p.startsWith("/admin") || p.startsWith("/secure-admin") || p.startsWith("/portal") || p.startsWith("/rider");
const publicPaths = ["/", "/account", "/forgot-password", "/reset-password", "/privacy", "/terms", "/delivery-information", "/returns-refunds"];
const isPublic = (p:string) => publicPaths.includes(p);
export default function SessionGate({children}:{children:React.ReactNode}) {
 const path=usePathname()||"/"; const router=useRouter();
 const [user,setUser]=useState<User|null>(null); const [loaded,setLoaded]=useState(false);
 useEffect(()=>{
  let active=true; setLoaded(false);
  api<{user:User}>("/auth/me").then(v=>{if(active){setUser(v.user);setLoaded(true);}}).catch(()=>{if(active){setUser(null);setLoaded(true);}});
  return ()=>{active=false;};
 },[path]);
 useEffect(()=>{
  const listener=()=>{setLoaded(false);api<{user:User}>("/auth/me").then(v=>{setUser(v.user);setLoaded(true)}).catch(()=>{setUser(null);setLoaded(true)})};
  window.addEventListener("medilink:session-changed",listener);return ()=>window.removeEventListener("medilink:session-changed",listener);
 },[]);
 const privateCustomerPage=!isPublic(path)&&!isAdminPath(path);
 if(privateCustomerPage&&!loaded)return <main className="sessionGate"><div className="sessionCard" role="status">Checking your secure MEDILINK session…</div></main>;
 if(privateCustomerPage&&!user)return <main className="sessionGate"><div className="sessionCard"><span className="kicker">MEMBER ACCESS</span><h1>Sign in to explore MEDILINK</h1><p>Discover medicines, save products, upload prescriptions and check out securely after logging in.</p><Link className="primaryBtn" href={`/account?next=${encodeURIComponent(path)}`}>Sign in or create an account →</Link><p><Link href="/">Return to welcome page</Link></p></div></main>;
 return <>{children}{loaded&&user&&user.role!=="admin"&&!isAdminPath(path)&&<FloatingHealthBot />}</>;
}
