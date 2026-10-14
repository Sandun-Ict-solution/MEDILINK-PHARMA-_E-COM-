"use client";
import {useState,type FormEvent} from "react";
import Link from "next/link";
import {post} from "../api-client";
export default function Forgot(){const[email,setEmail]=useState("");const[notice,setNotice]=useState("");const[busy,setBusy]=useState(false);
async function submit(e:FormEvent){e.preventDefault();setBusy(true);setNotice("");try{const r=await post<{message:string}>("/auth/forgot-password",{email});setNotice(r.message);}catch(e){setNotice(e instanceof Error?e.message:"Request failed");}finally{setBusy(false)}}
return <main className="adminLoginBackdrop"><section className="adminLoginCard"><Link href="/account" className="adminBack">← Back to login</Link><div className="adminEmblem">✚</div><p className="kicker">MEDILINK · ACCOUNT SECURITY</p><h1>Forgot your password?</h1><p className="adminMuted">Enter your registered email address to receive a password reset link. It expires after 20 minutes.</p><form onSubmit={submit}><label>Email address<input required type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><button disabled={busy} className="primaryBtn">{busy?"Sending…":"Email reset link →"}</button></form>{notice&&<p role="status">{notice}</p>}</section></main>}
