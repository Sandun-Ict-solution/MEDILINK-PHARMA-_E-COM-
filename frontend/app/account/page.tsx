"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ProductCard, Shell } from "../components";
import { productById } from "../data";
import { useStore } from "../store";
import { post } from "../api-client";
import GoogleLoginButton from "../GoogleLoginButton";

export default function Account() {
  const { profile, saveProfile, signOut, favourites, prescriptions, orders } = useStore();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState(""); const [password, setPassword] = useState("");
  const [smsOptIn, setSmsOptIn] = useState(false); const [mode, setMode] = useState<"login"|"register">("login");
  const [notice, setNotice] = useState(""); const [busy, setBusy] = useState(false);
  const [loginProgress, setLoginProgress] = useState(0);
  const [loginStage, setLoginStage] = useState<"authenticating" | "welcome">("authenticating");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(0);
  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);
  const startLoginAnimation = () => {
    startedRef.current = Date.now();
    setLoginProgress(0);
    setLoginStage("authenticating");
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startedRef.current;
      setLoginProgress(Math.min(99, Math.floor(elapsed / 100)));
    }, 80);
  };
  const stopLoginAnimation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
  };
  const waitForVisualCompletion = async () => {
    const remaining = Math.max(0, 650 - (Date.now() - startedRef.current));
    if (remaining) await new Promise<void>(resolve => setTimeout(resolve, remaining));
    setLoginProgress(100);
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setNotice("");
    if (mode === "login") startLoginAnimation();
    try {
      if (mode === "register") {
        const normalizedPhone = phone.trim().replace(/[\s()-]/g, "");
        const safePhone = /^07\d{8}$/.test(normalizedPhone) ? `+94${normalizedPhone.slice(1)}` : normalizedPhone || undefined;
        await post("/auth/register", { name, email, password, phone: safePhone, smsOptIn });
        setNotice("Registration successful! You can sign in now. Verify your email before checkout.");
        setMode("login");
      } else {
        const result = await post<{user:{name:string;email:string;phone:string;role:string;emailVerified:boolean}}>("/auth/login", { email, password });
        setLoginStage("welcome");
        await waitForVisualCompletion();
        saveProfile({ name:result.user.name, email:result.user.email, phone:result.user.phone || "", address:"" });
        window.location.assign(result.user.role==="admin" && result.user.emailVerified ? "/secure-admin" : "/discover");
      }
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Request failed");
    } finally {
      stopLoginAnimation();
      setBusy(false);
    }
  };
  const savedProducts = favourites.flatMap((id) => { const product = productById(id); return product ? [product] : []; });
  if (!profile) return <Shell><section className="accountPage section"><div className="accountIntro"><span className="pill">MEDILINK ACCOUNT</span><h1>{mode==="login"?"Welcome back":"Create an account"}</h1><p>Register and sign in securely. Email verification is required before checkout.</p></div><form className="uploadCard accountForm" onSubmit={submit}><h2>{mode==="login"?"Sign in":"Register"}</h2>
  {mode==="register" && <><label>Full name *<input required value={name} onChange={e=>setName(e.target.value)}/></label><label>Phone (international format, optional)<input placeholder="+94771234567" value={phone} onChange={e=>setPhone(e.target.value)}/></label><label><input type="checkbox" checked={smsOptIn} onChange={e=>setSmsOptIn(e.target.checked)}/> Receive SMS order updates</label></>}
  <label>Email *<input required type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password *<input required minLength={mode==="register"?10:1} type="password" value={password} onChange={e=>setPassword(e.target.value)}/></label>
  {notice && <p role="alert">{notice}</p>}
  {busy && mode === "login" && <div className="ecgLoginLoading" role="status" aria-live="polite" aria-label="Secure sign in in progress">
    <div className="ecgLoadingHead"><span className="ecgPulseDot"/> <strong>{loginStage === "welcome" ? "Authentication successful" : "Securing your session"}</strong><span className="ecgLoadingPercent">{loginProgress}%</span></div>
    <div className="ecgMonitor" aria-hidden="true"><svg viewBox="0 0 480 95" preserveAspectRatio="none"><defs><linearGradient id="ecgInk" x1="0" x2="1"><stop offset="0" stopColor="#16b8a1"/><stop offset="1" stopColor="#83f7b6"/></linearGradient></defs><path className="ecgGridBaseline" d="M0 54 H480"/><path className="ecgBeat" d="M0 54 H118 L130 54 L141 46 L152 64 L170 13 L190 84 L208 49 L218 54 H480"/></svg><div className="ecgScan"/></div>
    <div className="ecgProgressTrack"><div className="ecgProgressFill" style={{width:`${loginProgress}%`}}/></div>
    <div className="ecgLoadingBottom"><span>{loginStage === "welcome" ? "Welcome to MEDILINK" : "Verifying your credentials..."}</span><span>Secure login</span></div>
  </div>}
  <button className="primaryBtn" disabled={busy} type="submit">{busy ? (mode === "login" ? "Signing in securely..." : "Working...") : mode === "login" ? "Sign in" : "Register"}</button><button type="button" disabled={busy} className="secondaryBtn" onClick={()=>{setMode(mode==="login"?"register":"login");setNotice("");}}>{mode==="login"?"Create account":"Back to sign in"}</button>{mode==="login"&&<><div className="authAlt"><span>or continue with</span></div><GoogleLoginButton onSuccess={(user)=>{saveProfile({name:user.name,email:user.email,phone:user.phone||"",address:""});window.location.assign(user.role==="admin"?"/secure-admin":"/discover");}}/><p className="authRecovery"><Link href="/forgot-password">Forgot password?</Link></p></>}</form></section></Shell>;
  return <Shell><section className="dashboard section"><div className="dashboardHead"><div><span className="kicker">MY ACCOUNT</span><h1>Hello, {profile.name}</h1><p>{profile.email} · {profile.phone}</p></div><button className="secondaryBtn" onClick={signOut}>Sign out</button></div><div className="statGrid"><Link href="/orders"><b>{orders.length}</b><span>Orders</span></Link><div><b>{prescriptions.length}</b><span>Prescriptions</span></div><div><b>{favourites.length}</b><span>Favourites</span></div></div><div className="dashboardGrid"><div className="dashboardCard"><h2>Delivery details</h2><p><b>{profile.name}</b></p><p>{profile.address || "No default address saved"}</p><p>{profile.phone}</p></div><div className="dashboardCard"><h2>Latest prescription</h2>{prescriptions[0] ? <><p><b>{prescriptions[0].id}</b></p><p>{prescriptions[0].status}</p><small>{new Date(prescriptions[0].submittedAt).toLocaleString()}</small></> : <><p>No prescription submitted yet.</p><Link href="/prescription">Upload prescription →</Link></>}</div></div>{savedProducts.length > 0 && <section className="block"><div className="sectionHead"><div><span className="kicker">SAVED FOR LATER</span><h2>Your favourites</h2></div></div><div className="productGrid four">{savedProducts.slice(0, 4).map((product) => <ProductCard key={product.id} product={product}/>)}</div></section>}</section></Shell>;
}
