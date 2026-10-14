"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "./api-client";

type Campaign = { _id: string; title: string; subtitle?: string; buttonText?: string; buttonUrl?: string; mediaType: "image" | "video"; mediaUrl: string; posterUrl?: string; animation?: "fade" | "slide" | "zoom" };
const mediaSrc = (url:string) => url.startsWith('/uploads/') ? `${new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').origin}${url}` : url;
const demo: Campaign[] = [{ _id: "welcome", title: "Everyday care, delivered to your door", subtitle: "Explore healthcare essentials and wellness products at MEDILINK.", buttonText: "Explore products", buttonUrl: "/products", mediaType: "image", mediaUrl: "/assets/hero-pharmacy.png", animation: "fade" }];
export default function CampaignSlider() {
  const [slides, setSlides] = useState<Campaign[]>(demo);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => { let mounted = true; api<{campaigns: Campaign[]}>("/campaigns").then(r => { if (mounted && r.campaigns?.length) { setSlides(r.campaigns); setIndex(0); } }).catch(() => {}); return () => { mounted = false; }; }, []);
  useEffect(() => { if (paused || slides.length < 2) return; const id = window.setInterval(() => setIndex(i => (i + 1) % slides.length), 6500); return () => window.clearInterval(id); }, [paused, slides.length]);
  return <section className="campaign-wrap section" aria-label="Marketing campaigns" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false); }}>
    <div className="campaign-stage">{slides.map((slide, i) => <article key={slide._id} className={`campaign-slide campaign-${slide.animation || "fade"} ${i === index ? "visible" : ""}`} aria-hidden={i !== index}>
      <div className="campaign-media">{slide.mediaType === "video" ? <video src={mediaSrc(slide.mediaUrl)} poster={slide.posterUrl ? mediaSrc(slide.posterUrl) : undefined} autoPlay muted loop playsInline preload="metadata" /> : <img src={mediaSrc(slide.mediaUrl)} alt="" loading={i === 0 ? "eager" : "lazy"} />}</div>
      <div className="campaign-shade"/><div className="campaign-copy"><span className="campaign-kicker">MEDILINK · HEALTH & WELLNESS</span><h2>{slide.title}</h2><p>{slide.subtitle}</p><Link href={slide.buttonUrl || "/products"} tabIndex={i === index ? 0 : -1} className="campaign-cta">{slide.buttonText || "Shop now"} →</Link></div>
    </article>)}</div>
    {slides.length > 1 && <><button type="button" className="campaign-arrow campaign-prev" aria-label="Previous campaign" onClick={() => setIndex(i => (i + slides.length - 1) % slides.length)}>‹</button><button type="button" className="campaign-arrow campaign-next" aria-label="Next campaign" onClick={() => setIndex(i => (i + 1) % slides.length)}>›</button><div className="campaign-dots">{slides.map((s,i) => <button type="button" key={s._id} aria-label={`Show campaign ${i + 1}`} aria-current={i === index ? "true" : undefined} className={i === index ? "selected" : ""} onClick={() => setIndex(i)}/>)}</div></>}
  </section>;
}
