"use client";
import {useEffect,useState} from "react";
import Link from "next/link";
import {Shell} from "../components";
import {api} from "../api-client";
export default function Notifications(){const [data,setData]=useState<any[]>([]),[error,setError]=useState('');const load=async()=>{try{const r:any=await api('/notifications');setData(r.notifications||[])}catch(e){setError(e instanceof Error?e.message:'Could not load notifications')}};useEffect(()=>{void load()},[]);return <Shell><section className="section"><p className="kicker">MEDILINK UPDATES</p><h1>Your notifications</h1><p>Private order and delivery activity.</p>{error&&<p role="alert">{error}</p>}{data.map(n=><article key={n._id} className="uploadCard" style={{marginBlock:12}}><b>{n.title}</b><p>{n.message}</p><small>{new Date(n.createdAt).toLocaleString()}</small>{!n.readAt&&<button onClick={async()=>{await api(`/notifications/${n._id}/read`,{method:'PATCH'});await load()}}>Mark as read</button>}</article>)}{!data.length&&!error&&<p>No notifications yet.</p>}<Link href="/orders">Your orders →</Link></section></Shell>}
