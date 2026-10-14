"use client";
import { useEffect, useState, type FormEvent } from "react";
import { api, post } from "../../api-client";
type Campaign = { _id:string; title:string; subtitle:string; mediaUrl:string; mediaType:"image"|"video"; buttonText:string; buttonUrl:string; animation:"fade"|"slide"|"zoom"; active:boolean; sortOrder:number };
const empty = {title:"",subtitle:"",mediaUrl:"/assets/hero-pharmacy.png",mediaType:"image" as const,buttonText:"Shop now",buttonUrl:"/products",animation:"fade" as const,active:false,sortOrder:0};
export default function CampaignAdmin(){
 const [items,setItems]=useState<Campaign[]>([]);const [form,setForm]=useState<typeof empty>(empty);const [error,setError]=useState("");const [busy,setBusy]=useState(false);const [uploading,setUploading]=useState(false);
 async function reload(){try{const r=await api<{campaigns:Campaign[]}>("/admin/campaigns");setItems(r.campaigns);setError("");}catch(e){setError(e instanceof Error?e.message:"Unable to load campaigns");}}
 useEffect(()=>{void reload()},[]);
 async function uploadFile(file:File){setUploading(true);setError("");try{
  const allowed=["image/jpeg","image/png","image/webp","video/mp4"];
  if(!allowed.includes(file.type))throw new Error("Choose JPG, PNG, WebP or MP4");
  if(file.size>(file.type==="video/mp4"?80:10)*1024*1024)throw new Error("File is too large");
  const data=new FormData();data.append("file",file);
  const result=await fetch(`${(process.env.NEXT_PUBLIC_API_URL||"http://localhost:4000/api")}/admin/campaigns/upload`,{method:"POST",credentials:"include",body:data});
  const json=await result.json().catch(()=>({}));if(!result.ok)throw new Error(json.error||`Upload failed (${result.status})`);
  setForm(f=>({...f,mediaUrl:json.mediaUrl,mediaType:json.mediaType}));
 }catch(e){setError(e instanceof Error?e.message:"Upload failed")}finally{setUploading(false)}}
 async function create(e:FormEvent){e.preventDefault();setBusy(true);try{await post("/admin/campaigns",form);setForm(empty);await reload()}catch(e){setError(e instanceof Error?e.message:"Failed")}finally{setBusy(false)}}
 async function toggle(c:Campaign){try{await api(`/admin/campaigns/${c._id}`,{method:"PATCH",body:JSON.stringify({active:!c.active})});await reload()}catch(e){setError(e instanceof Error?e.message:"Failed")}}
 async function remove(c:Campaign){if(!window.confirm(`Delete ${c.title}?`))return;try{await api(`/admin/campaigns/${c._id}`,{method:"DELETE"});await reload()}catch(e){setError(e instanceof Error?e.message:"Failed")}}
 return <main className="campaignStudio"><header className="campaignStudioHero"><a href="/secure-admin">← Admin workspace</a><span className="campaignEyebrow">MEDILINK · MARKETING OPERATIONS</span><h1>Campaign studio</h1><p>Create, schedule and manage homepage image and video campaigns. Changes require an authorized admin session.</p></header>{error&&<p role="alert" className="campaignError">{error}</p>}
 <form className="campaignStudioForm" onSubmit={create}>
 <label>Campaign title<input required maxLength={120} value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></label>
 <label>Description<textarea maxLength={300} value={form.subtitle} onChange={e=>setForm({...form,subtitle:e.target.value})}/></label>
 <label>Upload image or video from your computer (JPG/PNG/WebP up to 10 MB, MP4 up to 80 MB)
 <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4" disabled={uploading} onChange={e=>{const file=e.target.files?.[0];if(file)void uploadFile(file);e.currentTarget.value=""}} />
 </label>{uploading&&<p role="status">Uploading file...</p>}{form.mediaUrl.startsWith("/uploads/")&&<p role="status">Uploaded: {form.mediaUrl}</p>}
 <label>Image/video URL (/uploads/... /assets/... or HTTPS)<input required value={form.mediaUrl} onChange={e=>setForm({...form,mediaUrl:e.target.value})}/></label>
 <label>Media type <select value={form.mediaType} onChange={e=>setForm({...form,mediaType:e.target.value as "image"|"video"})}><option value="image">Image</option><option value="video">Video (MP4)</option></select></label>
 <label>Button label<input value={form.buttonText} onChange={e=>setForm({...form,buttonText:e.target.value})}/></label>
 <label>Button destination<input value={form.buttonUrl} onChange={e=>setForm({...form,buttonUrl:e.target.value})}/></label>
 <label>Animation <select value={form.animation} onChange={e=>setForm({...form,animation:e.target.value as typeof empty.animation})}><option>fade</option><option>slide</option><option>zoom</option></select></label>
 <label>Sort order<input type="number" value={form.sortOrder} onChange={e=>setForm({...form,sortOrder:Number(e.target.value)})}/></label>
 <label><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})}/> Publish now</label>
 <button className="campaignSubmit" disabled={busy||uploading} type="submit">{busy?"Saving...":"Create campaign"}</button></form>
 <h2>Existing campaigns</h2>{!items.length&&<p className="adminEmpty">No campaigns yet. Add a new slide to publish a homepage promotion.</p>}{items.map(c=><article key={c._id} className="campaignItem"><strong>{c.title}</strong><span>{c.mediaType} · {c.active?"Published":"Draft"}</span><button onClick={()=>toggle(c)}>{c.active?"Unpublish":"Publish"}</button><button onClick={()=>remove(c)}>Delete</button></article>)}
 </main>;
}
