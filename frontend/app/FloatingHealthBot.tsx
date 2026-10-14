"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { post } from "./api-client";

type Reply = { reply: string; urgent: boolean; mode: string; suggestions?: { sku: string; name: string; reason: string }[]; notice?: string };
type Message = { role: "assistant" | "user"; content: string; urgent?: boolean };

const initial: Message[] = [{ role: "assistant", content: "Hi! I'm MEDILINK Health Helper. Ask a general wellness question. I can't diagnose or prescribe medicines." }];

export default function FloatingHealthBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initial);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [useHistory, setUseHistory] = useState(false);
  const [readAloud, setReadAloud] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { if (open) { field.current?.focus(); end.current?.scrollIntoView({ behavior: "smooth", block: "end" }); } }, [open, messages.length]);
  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);
  function speak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.slice(0, 1800));
    utterance.lang = /[\u0D80-\u0DFF]/.test(text) ? "si-LK" : "en-US";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }
  useEffect(() => () => { if(typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel(); }, []);
  async function send(e: React.FormEvent) {
    e.preventDefault();
    const question = input.trim();
    if (busy || question.length < 3 || question.length > 900) return;
    setInput(""); setError(""); setBusy(true);
    setMessages(m => [...m, { role: "user", content: question }]);
    try {
      const result = await post<Reply>("/health-helper/ask", { message: question, useOrderHistory: useHistory });
      const products = (result.suggestions || []).slice(0, 3).map(s => `• ${s.name} — ${s.reason}`).join("\n");
      setMessages(m => [...m, { role: "assistant", content: result.reply + (products ? `\n\nGeneral wellness accessories (not treatments):\n${products}` : ""), urgent: result.urgent }]);
      if(readAloud) speak(result.reply);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to contact Health Helper");
      setInput(question);
    } finally { setBusy(false); }
  }
  return <div className="medBotRoot">
    {open && <section className="medBotPanel" role="dialog" aria-modal="false" aria-label="MEDILINK health helper chat">
      <header className="medBotHeader">
        <div className="medBotBrand"><img className="medBotHeaderMascot" src="/assets/medilink-robot-assistant.png" alt="" aria-hidden="true" /><div><strong>MEDILINK Health Helper</strong><small>General health guidance</small></div></div>
        <button type="button" className="medBotClose" onClick={() => setOpen(false)} aria-label="Close assistant">×</button>
      </header>
      <div className="medBotVoiceTools"><label><input type="checkbox" checked={readAloud} onChange={e => {setReadAloud(e.target.checked); if (!e.target.checked && typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();}}/> 🔊 Speak replies</label><button type="button" onClick={() => {if(typeof window!=="undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();}} aria-label="Stop chatbot voice">Stop voice</button></div>
      <div className="medBotSafety">For emergencies, seek urgent medical care. No diagnoses, prescriptions or medicine substitutions.</div>
      <div className="medBotMessages" aria-live="polite" aria-relevant="additions text">
        {messages.map((m, i) => <div key={i} className={`medBotBubble ${m.role === "user" ? "medBotUser" : "medBotAssistant"} ${m.urgent ? "medBotUrgent" : ""}`}>{m.content}{m.role === "assistant" && <button type="button" className="medBotReadButton" onClick={() => speak(m.content)} aria-label="Read this response aloud">🔊 Listen</button>}</div>)}
        {busy && <div className="medBotBubble medBotAssistant medBotTyping" aria-label="Preparing response"><span/><span/><span/></div>}
        <div ref={end}/>
      </div>
      {error && <p className="medBotError" role="alert">{error}. <Link href="/account" onClick={() => setOpen(false)}>Sign in</Link> if required.</p>}
      <form className="medBotForm" onSubmit={send}>
        <label className="medBotConsent"><input type="checkbox" checked={useHistory} onChange={e => setUseHistory(e.target.checked)}/> Use my orders for accessory suggestions</label>
        <div className="medBotComposer"><textarea ref={field} rows={2} value={input} maxLength={900} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } }} placeholder="Ask a wellness question…" aria-label="Your health question"/><button type="submit" disabled={busy || input.trim().length < 3} aria-label="Send message">➤</button></div>
        <div className="medBotFooter"><Link href="/health-helper" onClick={() => setOpen(false)}>Open full assistant ↗</Link><span>Health education only</span></div>
      </form>
    </section>}
    <button className={`medBotLauncher ${open ? "medBotActive" : ""}`} type="button" onClick={() => setOpen(v => !v)} aria-label={open ? "Close health chatbot" : "Open health chatbot"} aria-expanded={open} title="MEDILINK Health Helper">{open ? <span className="medBotLauncherIcon" aria-hidden="true">×</span> : <img className="medBotRobotImage" src="/assets/medilink-robot-assistant.png" alt="" aria-hidden="true" />}{!open && <span className="medBotLauncherText">Ask MEDILINK AI</span>}</button>
  </div>;
}
