import { useState, useRef, useEffect } from "react";

// ─── API ────────────────────────────────────────────────────────────────────
const BASE_URL = "http://127.0.0.1:8000";
async function apiPost(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || `Server error ${res.status}`);
  }
  return (await res.json()).data;
}
const generateTopics = (theme, more = false) => apiPost("/generate-topics", { theme, count: 5, more });
const generateFullPodcast = (theme, topic) => apiPost("/generate-full-podcast", { theme, topic });
const generalChat = (user_message) => apiPost("/chat", { user_message });

// ─── Icons ───────────────────────────────────────────────────────────────────
const Mic = ({ s = 20 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>;
const Send = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const ChevRight = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const Check = ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
const X = () => <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const User = () => <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const Zap = ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
const Shield = ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const Brain = ({ s = 18 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>;
const Download = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const Copy = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
const Refresh = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>;
const LogOut = () => <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;

// ─── Spinner ─────────────────────────────────────────────────────────────────
const Spin = () => <span style={{ display:"inline-block", width:15, height:15, border:"2px solid rgba(255,255,255,0.2)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin .7s linear infinite" }} />;

// ─── Shared Styles ────────────────────────────────────────────────────────────
const inp = { width:"100%", boxSizing:"border-box", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"12px 16px", fontSize:14, color:"#fff", fontFamily:"inherit", outline:"none", transition:"all .2s" };
const lbl = { fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)" };
const priBtn = { padding:"13px 28px", borderRadius:11, border:"none", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8, transition:"all .2s", boxShadow:"0 4px 24px rgba(99,102,241,0.35)" };
const ghostBtn = { padding:"10px 20px", borderRadius:10, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.7)", fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:7, transition:"all .2s" };
const errBox = { background:"rgba(239,68,68,0.08)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:10, padding:"12px 16px", color:"#fca5a5", fontSize:13 };

// ─── Nav ─────────────────────────────────────────────────────────────────────
function Nav({ page, setPage, user, setUser }) {
  const [accountOpen, setAccountOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setAccountOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const links = ["Features", "How It Works", "Pricing"];

  return (
    <header style={{ position:"fixed", top:0, left:0, right:0, zIndex:200, background:"rgba(6,8,18,0.85)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 48px", height:64, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        {/* Logo */}
        <button onClick={() => setPage("landing")} style={{ display:"flex", alignItems:"center", gap:10, background:"none", border:"none", cursor:"pointer", color:"#fff" }}>
          <div style={{ width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(99,102,241,0.4)" }}>
            <Mic s={16} />
          </div>
          <span style={{ fontWeight:800, fontSize:16, letterSpacing:"-0.02em" }}>PodcastAI</span>
          <span style={{ fontSize:9, color:"rgba(255,255,255,0.3)", letterSpacing:"0.15em", textTransform:"uppercase", marginLeft:-4 }}>STUDIO</span>
        </button>

        {/* Nav links */}
        <nav style={{ display:"flex", alignItems:"center", gap:4 }}>
          {links.map(l => (
            <button key={l} onClick={() => setPage(l.toLowerCase().replace(/ /g,"-"))} style={{
              background:"none", border:"none", cursor:"pointer", fontFamily:"inherit",
              padding:"8px 16px", borderRadius:8, fontSize:14, fontWeight:500,
              color: page === l.toLowerCase().replace(/ /g,"-") ? "#a5b4fc" : "rgba(255,255,255,0.55)",
              transition:"all .2s",
            }}>{l}</button>
          ))}
        </nav>

        {/* Right */}
        <div style={{ display:"flex", alignItems:"center", gap:10 }} ref={ref}>
          {user ? (
            <div style={{ position:"relative" }}>
              <button onClick={() => setAccountOpen(o => !o)} style={{ display:"flex", alignItems:"center", gap:9, background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"7px 14px", cursor:"pointer", color:"#fff", fontFamily:"inherit", fontSize:13, fontWeight:600 }}>
                <div style={{ width:26, height:26, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700 }}>
                  {user.name[0].toUpperCase()}
                </div>
                {user.name}
              </button>
              {accountOpen && (
                <div style={{ position:"absolute", top:"calc(100% + 8px)", right:0, background:"rgba(12,14,26,0.98)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:12, padding:8, minWidth:200, boxShadow:"0 20px 60px rgba(0,0,0,0.5)", backdropFilter:"blur(20px)" }}>
                  <div style={{ padding:"10px 14px 8px", borderBottom:"1px solid rgba(255,255,255,0.07)", marginBottom:6 }}>
                    <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{user.name}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.4)", marginTop:2 }}>{user.email}</div>
                    <div style={{ fontSize:10, color:"#a5b4fc", marginTop:4, background:"rgba(99,102,241,0.15)", display:"inline-block", padding:"2px 8px", borderRadius:20, fontWeight:700 }}>{user.plan} Plan</div>
                  </div>
                  <button onClick={() => { setPage("account"); setAccountOpen(false); }} style={{ ...ghostBtn, width:"100%", justifyContent:"flex-start", padding:"9px 14px", border:"none", background:"none", color:"rgba(255,255,255,0.7)", fontSize:13 }}>
                    <User /> My Account
                  </button>
                  <button onClick={() => { setPage("studio"); setAccountOpen(false); }} style={{ ...ghostBtn, width:"100%", justifyContent:"flex-start", padding:"9px 14px", border:"none", background:"none", color:"rgba(255,255,255,0.7)", fontSize:13 }}>
                    <Mic s={16} /> Open Studio
                  </button>
                  <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", marginTop:6, paddingTop:6 }}>
                    <button onClick={() => { setUser(null); setPage("landing"); setAccountOpen(false); }} style={{ ...ghostBtn, width:"100%", justifyContent:"flex-start", padding:"9px 14px", border:"none", background:"none", color:"#f87171", fontSize:13 }}>
                      <LogOut /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <button onClick={() => setPage("login")} style={{ ...ghostBtn, padding:"8px 18px" }}>Sign In</button>
              <button onClick={() => setPage("studio")} style={{ ...priBtn, padding:"9px 20px", fontSize:13 }}>Get Started <ChevRight /></button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── Animated Floating Orb ────────────────────────────────────────────────────
function FloatingOrb({ x, y, size, color, delay, duration }) {
  return (
    <div style={{
      position:"absolute", left:`${x}%`, top:`${y}%`,
      width:size, height:size, borderRadius:"50%",
      background:`radial-gradient(circle at 35% 35%, ${color}, transparent 70%)`,
      filter:"blur(40px)", opacity:0.35,
      animation:`floatOrb ${duration}s ease-in-out ${delay}s infinite alternate`,
      pointerEvents:"none",
    }} />
  );
}

// ─── Animated Waveform ────────────────────────────────────────────────────────
function Waveform() {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:3, height:40 }}>
      {[0.4,0.7,1,0.85,0.6,0.9,0.5,0.75,1,0.65,0.8,0.45,0.95,0.7,0.55,0.85,1,0.6,0.75,0.4].map((h, i) => (
        <div key={i} style={{
          width:3, borderRadius:2,
          height:`${h * 100}%`,
          background:`linear-gradient(180deg, #818cf8, #c084fc)`,
          opacity: 0.7,
          animation:`waveBar 1.4s ease-in-out ${(i * 0.07).toFixed(2)}s infinite alternate`,
        }} />
      ))}
    </div>
  );
}

// ─── Typing Animation ─────────────────────────────────────────────────────────
function TypedText({ words }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    if (!deleting && charIdx <= current.length) {
      setDisplayed(current.slice(0, charIdx));
      timeout = setTimeout(() => setCharIdx(c => c + 1), 60);
    } else if (!deleting && charIdx > current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIdx > 0) {
      setDisplayed(current.slice(0, charIdx));
      timeout = setTimeout(() => setCharIdx(c => c - 1), 35);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx(w => (w + 1) % words.length);
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words]);

  return (
    <span style={{ background:"linear-gradient(135deg,#818cf8,#c084fc,#67e8f9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
      {displayed}<span style={{ opacity: Math.sin(Date.now()/300) > 0 ? 1 : 0, WebkitTextFillColor:"#818cf8" }}>|</span>
    </span>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimCounter({ target, suffix="" }) {
  const [val, setVal] = useState(0);
  const numTarget = parseFloat(target.replace(/[^0-9.]/g,""));
  useEffect(() => {
    let start = 0;
    const step = numTarget / 50;
    const timer = setInterval(() => {
      start += step;
      if (start >= numTarget) { setVal(numTarget); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [numTarget]);
  return <>{target.startsWith("<") ? target : `${val}${suffix || target.replace(/[0-9.]/g,"")}`}</>;
}

// ─── Landing Page ─────────────────────────────────────────────────────────────
function Landing({ setPage }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const steps = [
    { n:"01", title:"Enter Your Theme", desc:"Type any topic — tech, wellness, business, true crime. Our AI understands context and nuance.", icon:"🎯", color:"#6366f1" },
    { n:"02", title:"Pick a Topic Angle", desc:"Get 5 AI-generated episode ideas tailored to your niche. Regenerate as many times as you like.", icon:"💡", color:"#8b5cf6" },
    { n:"03", title:"Generate Your Script", desc:"Four AI agents work in sequence — topic refinement, outline, full script, safety review.", icon:"✍️", color:"#06b6d4" },
    { n:"04", title:"Download & Publish", desc:"Copy your script, download as text, or paste straight into your recording software.", icon:"🚀", color:"#10b981" },
  ];

  const stats = [{ v:"50K+", l:"Episodes Created" }, { v:"4", l:"AI Agents" }, { v:"< 60s", l:"Per Episode" }, { v:"99.9%", l:"Uptime" }];

  const typedWords = ["Tech Founders", "True Crime Fans", "Health & Wellness", "Business Leaders", "Science Nerds", "History Buffs"];

  const testimonials = [
    { name:"Sarah K.", role:"Indie Podcaster", text:"I went from spending 4 hours on a script to 40 seconds. Absolutely wild.", avatar:"S" },
    { name:"Marcus T.", role:"Content Creator", text:"The safety review agent alone is worth it. No more awkward edits after recording.", avatar:"M" },
    { name:"Priya L.", role:"Marketing Lead", text:"Our team uses this for every episode. The outline structure is always spot-on.", avatar:"P" },
  ];

  return (
    <div style={{ paddingTop:64, overflow:"hidden" }}>

      {/* ── Hero ── */}
      <section style={{ minHeight:"96vh", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden" }}>

        {/* Floating orbs */}
        <FloatingOrb x={8}  y={15} size={420} color="#6366f1" delay={0}   duration={7} />
        <FloatingOrb x={70} y={5}  size={320} color="#8b5cf6" delay={1.5} duration={9} />
        <FloatingOrb x={80} y={60} size={380} color="#06b6d4" delay={0.5} duration={8} />
        <FloatingOrb x={5}  y={65} size={280} color="#10b981" delay={2}   duration={6} />
        <FloatingOrb x={45} y={80} size={240} color="#c084fc" delay={1}   duration={10} />

        {/* Animated grid */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px)", backgroundSize:"60px 60px", pointerEvents:"none" }} />

        {/* Rotating ring */}
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:900, height:900, borderRadius:"50%", border:"1px dashed rgba(99,102,241,0.1)", animation:"slowSpin 40s linear infinite", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:650, height:650, borderRadius:"50%", border:"1px solid rgba(139,92,246,0.08)", animation:"slowSpin 28s linear infinite reverse", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:420, height:420, borderRadius:"50%", border:"1px solid rgba(99,102,241,0.12)", pointerEvents:"none" }} />

        {/* Floating mic icon */}
        <div style={{ position:"absolute", top:"18%", right:"12%", width:64, height:64, borderRadius:18, background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.3)", display:"flex", alignItems:"center", justifyContent:"center", animation:"floatY 4s ease-in-out infinite", backdropFilter:"blur(8px)", pointerEvents:"none" }}>
          <Mic s={28} />
        </div>
        <div style={{ position:"absolute", bottom:"22%", left:"10%", width:52, height:52, borderRadius:14, background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.25)", display:"flex", alignItems:"center", justifyContent:"center", animation:"floatY 5s ease-in-out 1s infinite", backdropFilter:"blur(8px)", fontSize:22, pointerEvents:"none" }}>
          ✍️
        </div>
        <div style={{ position:"absolute", top:"30%", left:"8%", width:48, height:48, borderRadius:12, background:"rgba(139,92,246,0.12)", border:"1px solid rgba(139,92,246,0.25)", display:"flex", alignItems:"center", justifyContent:"center", animation:"floatY 6s ease-in-out 2s infinite", backdropFilter:"blur(8px)", fontSize:20, pointerEvents:"none" }}>
          💡
        </div>

        {/* Hero content */}
        <div style={{ textAlign:"center", maxWidth:900, padding:"0 48px", position:"relative", zIndex:1, opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(24px)", transition:"all 1s cubic-bezier(0.16,1,0.3,1)" }}>

          {/* Badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"7px 18px", borderRadius:24, background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.3)", marginBottom:32, backdropFilter:"blur(8px)" }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#10b981", display:"inline-block", animation:"pulse 2s infinite", boxShadow:"0 0 8px #10b981" }} />
            <span style={{ fontSize:12, fontWeight:700, color:"#a5b4fc", letterSpacing:"0.1em", textTransform:"uppercase" }}>Multi-Agent AI Pipeline — Live</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize:80, fontWeight:900, lineHeight:1.05, letterSpacing:"-0.045em", marginBottom:16 }}>
            Podcast Scripts<br />
            for{" "}
            <TypedText words={typedWords} />
          </h1>

          <p style={{ fontSize:20, color:"rgba(255,255,255,0.5)", lineHeight:1.75, maxWidth:620, margin:"0 auto 20px" }}>
            From blank page to broadcast-ready script in under 60 seconds.
            Four AI agents collaborate so you don't have to.
          </p>

          {/* Waveform decoration */}
          <div style={{ display:"flex", justifyContent:"center", marginBottom:36, opacity:0.6 }}>
            <Waveform />
          </div>

          {/* CTAs */}
          <div style={{ display:"flex", gap:14, justifyContent:"center", marginBottom:64 }}>
            <button onClick={() => setPage("studio")} style={{ ...priBtn, fontSize:16, padding:"17px 40px", borderRadius:14, boxShadow:"0 8px 40px rgba(99,102,241,0.5)", animation:"subtlePulse 3s ease-in-out infinite" }}>
              Start Creating Free <ChevRight />
            </button>
            <button onClick={() => setPage("how-it-works")} style={{ ...ghostBtn, fontSize:15, padding:"17px 30px", borderRadius:14 }}>
              ▶ See How It Works
            </button>
          </div>

          {/* Stats */}
          <div style={{ display:"flex", gap:0, justifyContent:"center", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:"24px 0", backdropFilter:"blur(12px)", maxWidth:700, margin:"0 auto" }}>
            {stats.map((s, i) => (
              <div key={s.v} style={{ flex:1, textAlign:"center", borderRight: i < stats.length-1 ? "1px solid rgba(255,255,255,0.07)" : "none", padding:"0 16px" }}>
                <div style={{ fontSize:28, fontWeight:900, background:"linear-gradient(135deg,#a5b4fc,#c4b5fd)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", letterSpacing:"-0.02em" }}>
                  <AnimCounter target={s.v} />
                </div>
                <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)", marginTop:5, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process strip ── */}
      <section style={{ background:"rgba(255,255,255,0.018)", borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)", padding:"90px 0" }}>
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 64px" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", color:"#a5b4fc", textTransform:"uppercase", marginBottom:14 }}>The Process</div>
            <h2 style={{ fontSize:46, fontWeight:800, letterSpacing:"-0.03em" }}>Four steps. One killer episode.</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20, position:"relative" }}>
            {/* Connecting line */}
            <div style={{ position:"absolute", top:40, left:"12.5%", right:"12.5%", height:1, background:"linear-gradient(90deg,rgba(99,102,241,0.3),rgba(6,182,212,0.3))", pointerEvents:"none", zIndex:0 }} />
            {steps.map((s, i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.03)", border:`1px solid ${s.color}25`, borderRadius:18, padding:"28px 24px 32px", position:"relative", zIndex:1, transition:"all .35s", animation:`fadeSlideUp .6s ease ${i*0.12}s both` }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${s.color},transparent)`, borderRadius:"18px 18px 0 0" }} />
                <div style={{ width:44, height:44, borderRadius:12, background:`${s.color}18`, border:`1px solid ${s.color}35`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, marginBottom:16 }}>{s.icon}</div>
                <div style={{ fontSize:10, fontWeight:800, color:s.color, letterSpacing:"0.2em", marginBottom:10, opacity:0.7 }}>{s.n}</div>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:10, color:"#e0e7ff" }}>{s.title}</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.45)", lineHeight:1.75 }}>{s.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:52 }}>
            <button onClick={() => setPage("studio")} style={{ ...priBtn, margin:"0 auto" }}>Try It Now — Free <ChevRight /></button>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ padding:"100px 0" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 64px" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.12em", color:"#a5b4fc", textTransform:"uppercase", marginBottom:14 }}>What creators say</div>
            <h2 style={{ fontSize:42, fontWeight:800, letterSpacing:"-0.03em" }}>Loved by podcasters worldwide</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:"28px 26px", animation:`fadeSlideUp .6s ease ${i*0.15}s both` }}>
                <div style={{ fontSize:24, marginBottom:16, color:"#818cf8" }}>❝</div>
                <p style={{ fontSize:14.5, color:"rgba(255,255,255,0.7)", lineHeight:1.8, marginBottom:20, fontStyle:"italic" }}>{t.text}</p>
                <div style={{ display:"flex", alignItems:"center", gap:10, borderTop:"1px solid rgba(255,255,255,0.07)", paddingTop:16 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, fontSize:14 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{t.name}</div>
                    <div style={{ fontSize:11, color:"rgba(255,255,255,0.35)" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section style={{ padding:"100px 48px 120px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,0.12),transparent 65%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1, maxWidth:680, margin:"0 auto" }}>
          <h2 style={{ fontSize:52, fontWeight:900, letterSpacing:"-0.04em", marginBottom:16, lineHeight:1.1 }}>
            Your next episode is<br />
            <span style={{ background:"linear-gradient(135deg,#818cf8,#c084fc)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>60 seconds away.</span>
          </h2>
          <p style={{ fontSize:18, color:"rgba(255,255,255,0.4)", marginBottom:40, lineHeight:1.7 }}>Join thousands of creators who ship more with PodcastAI Studio.</p>
          <button onClick={() => setPage("studio")} style={{ ...priBtn, fontSize:17, padding:"18px 48px", margin:"0 auto", borderRadius:14, boxShadow:"0 8px 40px rgba(99,102,241,0.4)" }}>Get Started — It's Free <ChevRight /></button>
        </div>
      </section>
    </div>
  );
}

// ─── Features Page ────────────────────────────────────────────────────────────
function Features({ setPage }) {
  const features = [
    { icon:<Brain s={24}/>, title:"Multi-Agent AI", desc:"Four specialized agents collaborate — each with a single job done perfectly. Topic strategist, outline architect, script writer, safety reviewer.", color:"#6366f1" },
    { icon:<Zap s={24}/>, title:"Sub-60s Generation", desc:"From blank page to full production script in under a minute. No waiting, no prompting — just instant, broadcast-ready content.", color:"#f59e0b" },
    { icon:<Shield s={24}/>, title:"Built-in Safety Review", desc:"Every script passes through our safety agent before delivery, ensuring your content is appropriate, accurate, and on-brand.", color:"#10b981" },
    { icon:<Mic s={24}/>, title:"Topic Intelligence", desc:"Our topic agent understands niche context, audience intent, and trending angles. Not just keywords — actual podcast strategy.", color:"#8b5cf6" },
    { icon:<Copy s={24}/>, title:"Export Anywhere", desc:"Copy to clipboard, download as .txt, or pipe directly into your recording workflow. Your script, your format, your tools.", color:"#06b6d4" },
    { icon:<Refresh s={24}/>, title:"Unlimited Regeneration", desc:"Not happy? Regenerate any step — topic, outline, or full script — without losing your session state or starting over.", color:"#f43f5e" },
  ];

  return (
    <div style={{ paddingTop:64 }}>
      <section style={{ padding:"100px 48px 80px", textAlign:"center", maxWidth:800, margin:"0 auto" }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:"#a5b4fc", textTransform:"uppercase", marginBottom:14 }}>Features</div>
        <h1 style={{ fontSize:56, fontWeight:900, letterSpacing:"-0.04em", marginBottom:20, lineHeight:1.1 }}>
          Everything a podcaster needs.<br /><span style={{ color:"rgba(255,255,255,0.4)" }}>Nothing they don't.</span>
        </h1>
        <p style={{ fontSize:18, color:"rgba(255,255,255,0.45)", lineHeight:1.7, marginBottom:0 }}>Built for creators who want to ship more episodes without spending hours on scripts.</p>
      </section>

      <section style={{ maxWidth:1200, margin:"0 auto 100px", padding:"0 48px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:"32px 28px", transition:"all .3s", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,${f.color}80,transparent)` }} />
              <div style={{ width:48, height:48, borderRadius:12, background:`${f.color}20`, border:`1px solid ${f.color}30`, display:"flex", alignItems:"center", justifyContent:"center", color:f.color, marginBottom:20 }}>{f.icon}</div>
              <div style={{ fontSize:18, fontWeight:700, marginBottom:10, color:"#e0e7ff" }}>{f.title}</div>
              <div style={{ fontSize:14, color:"rgba(255,255,255,0.5)", lineHeight:1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign:"center", marginTop:56 }}>
          <button onClick={() => setPage("studio")} style={{ ...priBtn, margin:"0 auto" }}>Start Generating Episodes <ChevRight /></button>
        </div>
      </section>
    </div>
  );
}

// ─── How It Works Page ────────────────────────────────────────────────────────
function HowItWorks({ setPage }) {
  const [activeAgent, setActiveAgent] = useState(0);

  const agents = [
    {
      name:"Topic Agent", color:"#6366f1", bg:"rgba(99,102,241,0.1)", emoji:"💡",
      role:"Podcast Strategist",
      desc:"Receives your theme and transforms it into 5 targeted, engagement-optimized episode title ideas. Uses regex-based parsing and deduplication to ensure clean, unique outputs.",
      steps:["Receives raw theme input", "Prompts LLM with content strategy context", "Parses numbered list output via regex", "Deduplicates and enforces 110-char limit", "Returns clean topic array"],
      tech:["Ollama / llama3","Regex parser","Deduplication logic"],
    },
    {
      name:"Outline Agent", color:"#8b5cf6", bg:"rgba(139,92,246,0.1)", emoji:"📋",
      role:"Structure Architect",
      desc:"Takes a confirmed topic and builds a full structured episode blueprint — intro, 3–5 core sections with talking points, and a conclusion. Sets the backbone for the entire script.",
      steps:["Receives confirmed topic string", "Constructs structured outline prompt", "Generates intro + 3–5 sections + conclusion", "Returns markdown-formatted outline", "Passes outline to Script Agent"],
      tech:["Prompt chaining","Structured output","Section enforcement"],
    },
    {
      name:"Script Agent", color:"#06b6d4", bg:"rgba(6,182,212,0.1)", emoji:"✍️",
      role:"Script Writer",
      desc:"Expands the outline into a full conversational podcast script. Writes host dialogue, transitions, and segment intros in a natural, broadcast-ready tone.",
      steps:["Receives full outline from previous agent", "Writes host-style narration per section", "Adds transitions and natural language flow", "Generates timestamp markers", "Outputs complete production script"],
      tech:["Long-form generation","Dialogue modeling","Broadcast tone"],
    },
    {
      name:"Safety Agent", color:"#10b981", bg:"rgba(16,185,129,0.1)", emoji:"🛡️",
      role:"Content Reviewer",
      desc:"Final gatekeeper. Reviews the complete script for inappropriate content, factual red flags, and quality issues. Rewrites any flagged sections before delivery.",
      steps:["Receives full script from Script Agent", "Scans for unsafe or inappropriate content", "Checks for clarity and engagement quality", "Rewrites any problematic sections", "Delivers final approved script"],
      tech:["Content moderation","Rewrite capability","Quality scoring"],
    },
  ];

  const flow = ["User Input", "Topic Agent", "Outline Agent", "Script Agent", "Safety Agent", "Final Script"];

  return (
    <div style={{ paddingTop:64 }}>
      <section style={{ padding:"100px 48px 60px", textAlign:"center", maxWidth:800, margin:"0 auto" }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:"#a5b4fc", textTransform:"uppercase", marginBottom:14 }}>Architecture</div>
        <h1 style={{ fontSize:54, fontWeight:900, letterSpacing:"-0.04em", marginBottom:18, lineHeight:1.1 }}>How the AI Pipeline Works</h1>
        <p style={{ fontSize:17, color:"rgba(255,255,255,0.45)", lineHeight:1.7 }}>Four independent agents, each an expert in its role, passing outputs as inputs in a deterministic chain.</p>
      </section>

      {/* Pipeline flow */}
      <section style={{ maxWidth:1200, margin:"0 48px 60px", padding:"0 48px" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:0, flexWrap:"wrap", background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:"28px 36px" }}>
          {flow.map((f, i) => (
            <div key={f} style={{ display:"flex", alignItems:"center" }}>
              <div style={{
                padding:"10px 20px", borderRadius:10, fontSize:13, fontWeight:700,
                background: i === 0 || i === flow.length-1 ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.05)",
                border: i === 0 || i === flow.length-1 ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.1)",
                color: i === 0 || i === flow.length-1 ? "#c7d2fe" : "rgba(255,255,255,0.7)",
              }}>{f}</div>
              {i < flow.length-1 && (
                <div style={{ display:"flex", alignItems:"center", gap:2, margin:"0 8px" }}>
                  <div style={{ width:20, height:1, background:"rgba(99,102,241,0.4)" }} />
                  <div style={{ width:0, height:0, borderTop:"5px solid transparent", borderBottom:"5px solid transparent", borderLeft:"7px solid rgba(99,102,241,0.4)" }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Agent explorer */}
      <section style={{ maxWidth:1200, margin:"0 auto 100px", padding:"0 48px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"280px 1fr", gap:24 }}>
          {/* Sidebar */}
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {agents.map((a, i) => (
              <button key={i} onClick={() => setActiveAgent(i)} style={{
                background: activeAgent === i ? a.bg : "rgba(255,255,255,0.03)",
                border: `1px solid ${activeAgent === i ? a.color+"60" : "rgba(255,255,255,0.07)"}`,
                borderRadius:12, padding:"16px 18px", textAlign:"left", cursor:"pointer", fontFamily:"inherit",
                display:"flex", alignItems:"center", gap:12, transition:"all .2s",
              }}>
                <span style={{ fontSize:22 }}>{a.emoji}</span>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color: activeAgent === i ? "#fff" : "rgba(255,255,255,0.7)" }}>{a.name}</div>
                  <div style={{ fontSize:11, color: activeAgent === i ? a.color : "rgba(255,255,255,0.3)", fontWeight:600, marginTop:2 }}>{a.role}</div>
                </div>
                {activeAgent === i && <div style={{ marginLeft:"auto", color:a.color }}><ChevRight /></div>}
              </button>
            ))}
          </div>

          {/* Detail */}
          {(() => {
            const a = agents[activeAgent];
            return (
              <div key={activeAgent} style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:18, padding:"36px 36px", animation:"fadeIn .3s ease" }}>
                <div style={{ display:"flex", alignItems:"flex-start", gap:16, marginBottom:24 }}>
                  <div style={{ width:56, height:56, borderRadius:14, background:a.bg, border:`1px solid ${a.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>{a.emoji}</div>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:a.color, marginBottom:4 }}>{a.role}</div>
                    <div style={{ fontSize:24, fontWeight:800, color:"#e0e7ff" }}>{a.name}</div>
                  </div>
                </div>
                <p style={{ fontSize:15, color:"rgba(255,255,255,0.6)", lineHeight:1.8, marginBottom:28 }}>{a.desc}</p>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", marginBottom:12 }}>Execution Steps</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {a.steps.map((s, i) => (
                        <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:10 }}>
                          <div style={{ width:20, height:20, borderRadius:"50%", background:a.bg, border:`1px solid ${a.color}50`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:800, color:a.color, flexShrink:0, marginTop:1 }}>{i+1}</div>
                          <div style={{ fontSize:13, color:"rgba(255,255,255,0.65)", lineHeight:1.5 }}>{s}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase", color:"rgba(255,255,255,0.4)", marginBottom:12 }}>Technologies</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {a.tech.map((t, i) => (
                        <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:6, height:6, borderRadius:"50%", background:a.color, flexShrink:0 }} />
                          <div style={{ fontSize:13, color:"rgba(255,255,255,0.6)", fontWeight:500 }}>{t}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop:24, background:a.bg, border:`1px solid ${a.color}30`, borderRadius:12, padding:"14px 16px" }}>
                      <div style={{ fontSize:11, fontWeight:700, color:a.color, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Input → Output</div>
                      <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", lineHeight:1.6 }}>
                        {activeAgent === 0 && "theme string → topics[]"}
                        {activeAgent === 1 && "topic string → outline markdown"}
                        {activeAgent === 2 && "outline markdown → full script"}
                        {activeAgent === 3 && "raw script → reviewed script"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        <div style={{ textAlign:"center", marginTop:56 }}>
          <button onClick={() => setPage("studio")} style={{ ...priBtn, margin:"0 auto" }}>Experience the Pipeline Live <ChevRight /></button>
        </div>
      </section>
    </div>
  );
}

// ─── Pricing Page ─────────────────────────────────────────────────────────────
function Pricing({ setPage, setUser }) {
  const plans = [
    {
      name:"Free", price:0, period:"forever", color:"rgba(255,255,255,0.06)", border:"rgba(255,255,255,0.1)", btnStyle:ghostBtn,
      desc:"Perfect for trying things out",
      features:["5 episodes/month","All 4 AI agents","Topic generation","Script download","Community support"],
      missing:["Custom voice style","Priority generation","Analytics dashboard","API access"],
    },
    {
      name:"Pro", price:19, period:"per month", color:"rgba(99,102,241,0.12)", border:"rgba(99,102,241,0.35)", btnStyle:{...priBtn}, popular:true,
      desc:"For serious podcast creators",
      features:["Unlimited episodes","All 4 AI agents","Topic generation","Script download","Custom voice style","Priority generation","Analytics dashboard","Email support"],
      missing:["API access"],
    },
    {
      name:"Studio", price:49, period:"per month", color:"rgba(139,92,246,0.1)", border:"rgba(139,92,246,0.3)", btnStyle:{...ghostBtn, borderColor:"rgba(139,92,246,0.4)", color:"#c4b5fd"},
      desc:"For agencies and teams",
      features:["Unlimited episodes","All 4 AI agents","Topic generation","Script download","Custom voice style","Priority generation","Analytics dashboard","API access","Team collaboration","Dedicated support","White-label export"],
      missing:[],
    },
  ];

  return (
    <div style={{ paddingTop:64 }}>
      <section style={{ padding:"100px 48px 60px", textAlign:"center", maxWidth:700, margin:"0 auto" }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:"#a5b4fc", textTransform:"uppercase", marginBottom:14 }}>Pricing</div>
        <h1 style={{ fontSize:54, fontWeight:900, letterSpacing:"-0.04em", marginBottom:16, lineHeight:1.1 }}>Simple, transparent pricing</h1>
        <p style={{ fontSize:17, color:"rgba(255,255,255,0.45)", lineHeight:1.7 }}>Start free. Upgrade when you're ready. No hidden fees, no per-word billing.</p>
      </section>

      <section style={{ maxWidth:1100, margin:"0 auto 100px", padding:"0 48px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, alignItems:"start" }}>
          {plans.map((p, i) => (
            <div key={i} style={{ background:p.color, border:`1px solid ${p.border}`, borderRadius:20, padding:"32px 28px", position:"relative", transition:"all .3s" }}>
              {p.popular && (
                <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#6366f1,#8b5cf6)", padding:"4px 16px", borderRadius:20, fontSize:11, fontWeight:800, letterSpacing:"0.08em", textTransform:"uppercase", color:"#fff", whiteSpace:"nowrap" }}>Most Popular</div>
              )}
              <div style={{ fontSize:18, fontWeight:800, marginBottom:4, color:"#fff" }}>{p.name}</div>
              <div style={{ fontSize:13, color:"rgba(255,255,255,0.4)", marginBottom:24 }}>{p.desc}</div>
              <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:28 }}>
                <span style={{ fontSize:48, fontWeight:900, letterSpacing:"-0.04em", color:"#fff" }}>${p.price}</span>
                <span style={{ fontSize:13, color:"rgba(255,255,255,0.4)", fontWeight:500 }}>/{p.period}</span>
              </div>
              <button onClick={() => { setUser({ name:"Demo User", email:"demo@podcastai.com", plan:p.name }); setPage("studio"); }} style={{ ...p.btnStyle, width:"100%", marginBottom:28 }}>
                {p.price === 0 ? "Get Started Free" : `Start ${p.name} Plan`}
              </button>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {p.features.map((f, j) => (
                  <div key={j} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:18, height:18, borderRadius:"50%", background:"rgba(16,185,129,0.2)", border:"1px solid rgba(16,185,129,0.4)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:"#10b981" }}><Check s={10}/></div>
                    <span style={{ fontSize:13, color:"rgba(255,255,255,0.7)" }}>{f}</span>
                  </div>
                ))}
                {p.missing.map((f, j) => (
                  <div key={j} style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:18, height:18, borderRadius:"50%", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:"rgba(255,255,255,0.2)" }}><X/></div>
                    <span style={{ fontSize:13, color:"rgba(255,255,255,0.25)" }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign:"center", fontSize:13, color:"rgba(255,255,255,0.3)", marginTop:36 }}>All plans include a 14-day money-back guarantee. Cancel anytime.</p>
      </section>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
function Login({ setPage, setUser }) {
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  function handle() {
    if (!email || !pass || (mode === "signup" && !name)) { setErr("Please fill in all fields."); return; }
    setUser({ name: mode === "signup" ? name : email.split("@")[0], email, plan:"Free" });
    setPage("studio");
  }

  return (
    <div style={{ paddingTop:64, minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"80px 24px" }}>
      <div style={{ width:"100%", maxWidth:440 }}>
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", boxShadow:"0 8px 24px rgba(99,102,241,0.4)" }}><Mic s={22}/></div>
          <h1 style={{ fontSize:28, fontWeight:800, letterSpacing:"-0.03em", marginBottom:8 }}>{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.4)" }}>{mode === "signin" ? "Sign in to your PodcastAI Studio account" : "Start generating episodes in seconds"}</p>
        </div>

        <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"32px 32px" }}>
          {mode === "signup" && (
            <div style={{ marginBottom:16 }}>
              <label style={{ ...lbl, display:"block", marginBottom:8 }}>Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inp} />
            </div>
          )}
          <div style={{ marginBottom:16 }}>
            <label style={{ ...lbl, display:"block", marginBottom:8 }}>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" style={inp} />
          </div>
          <div style={{ marginBottom: err ? 16 : 24 }}>
            <label style={{ ...lbl, display:"block", marginBottom:8 }}>Password</label>
            <input value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" type="password" style={inp} onKeyDown={e => e.key==="Enter" && handle()} />
          </div>
          {err && <div style={{ ...errBox, marginBottom:16 }}>{err}</div>}
          <button onClick={handle} style={{ ...priBtn, width:"100%" }}>
            {mode === "signin" ? "Sign In" : "Create Account"}
          </button>
        </div>

        <p style={{ textAlign:"center", fontSize:13, color:"rgba(255,255,255,0.4)", marginTop:20 }}>
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setErr(""); }} style={{ background:"none", border:"none", color:"#a5b4fc", cursor:"pointer", fontFamily:"inherit", fontSize:13, fontWeight:600 }}>
            {mode === "signin" ? "Sign up free" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── Account Page ─────────────────────────────────────────────────────────────
function Account({ user, setPage }) {
  const [tab, setTab] = useState("overview");
  const episodes = [
    { topic:"The Future of AI in Healthcare", theme:"Technology", date:"Mar 9, 2026", words:1840 },
    { topic:"How Startups Are Disrupting Finance", theme:"Business", date:"Mar 7, 2026", words:2100 },
    { topic:"Dark Matter: What We Still Don't Know", theme:"Science", date:"Mar 5, 2026", words:1620 },
  ];

  return (
    <div style={{ paddingTop:64, minHeight:"100vh" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"60px 48px" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:48 }}>
          <div style={{ width:72, height:72, borderRadius:18, background:"linear-gradient(135deg,#6366f1,#8b5cf6)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, fontWeight:900, boxShadow:"0 8px 28px rgba(99,102,241,0.4)" }}>
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <h1 style={{ fontSize:28, fontWeight:800, letterSpacing:"-0.02em", marginBottom:4 }}>{user.name}</h1>
            <div style={{ fontSize:14, color:"rgba(255,255,255,0.45)", marginBottom:6 }}>{user.email}</div>
            <div style={{ display:"inline-block", padding:"3px 12px", borderRadius:20, background:"rgba(99,102,241,0.15)", border:"1px solid rgba(99,102,241,0.3)", fontSize:11, fontWeight:700, color:"#a5b4fc", letterSpacing:"0.08em", textTransform:"uppercase" }}>{user.plan} Plan</div>
          </div>
          <button onClick={() => setPage("studio")} style={{ ...priBtn, marginLeft:"auto" }}>Open Studio <ChevRight /></button>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", gap:4, background:"rgba(255,255,255,0.04)", borderRadius:12, padding:5, marginBottom:32, width:"fit-content" }}>
          {["overview","episodes","settings"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding:"9px 20px", borderRadius:9, border:"none", background:tab===t?"rgba(99,102,241,0.28)":"transparent", color:tab===t?"#c7d2fe":"rgba(255,255,255,0.45)", fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit", transition:"all .2s", textTransform:"capitalize" }}>{t}</button>
          ))}
        </div>

        {tab === "overview" && (
          <div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:36 }}>
              {[{v:"3",l:"Episodes This Month"},{v:"5,560",l:"Total Words Generated"},{v:"4",l:"AI Agents Used"},{v:"Free",l:"Current Plan"}].map((s,i) => (
                <div key={i} style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"24px 20px" }}>
                  <div style={{ fontSize:30, fontWeight:900, letterSpacing:"-0.03em", color:"#e0e7ff", marginBottom:6 }}>{s.v}</div>
                  <div style={{ fontSize:12, color:"rgba(255,255,255,0.4)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em" }}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{ background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.25)", borderRadius:16, padding:"24px 28px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <div style={{ fontSize:16, fontWeight:700, marginBottom:4 }}>Upgrade to Pro</div>
                <div style={{ fontSize:13, color:"rgba(255,255,255,0.5)" }}>Get unlimited episodes, priority generation, and analytics.</div>
              </div>
              <button onClick={() => setPage("pricing")} style={{ ...priBtn, whiteSpace:"nowrap" }}>View Plans <ChevRight /></button>
            </div>
          </div>
        )}

        {tab === "episodes" && (
          <div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {episodes.map((e,i) => (
                <div key={i} style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"20px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontSize:15, fontWeight:700, color:"#e0e7ff", marginBottom:4 }}>{e.topic}</div>
                    <div style={{ fontSize:12, color:"rgba(255,255,255,0.35)" }}>Theme: {e.theme} · {e.date} · ~{e.words} words</div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    <button style={{ ...ghostBtn, padding:"7px 14px", fontSize:12 }}><Copy s={13}/> Copy</button>
                    <button style={{ ...ghostBtn, padding:"7px 14px", fontSize:12 }}><Download s={13}/> Download</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div style={{ maxWidth:520 }}>
            <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
              <div>
                <label style={{ ...lbl, display:"block", marginBottom:8 }}>Display Name</label>
                <input defaultValue={user.name} style={inp} />
              </div>
              <div>
                <label style={{ ...lbl, display:"block", marginBottom:8 }}>Email Address</label>
                <input defaultValue={user.email} style={inp} />
              </div>
              <div>
                <label style={{ ...lbl, display:"block", marginBottom:8 }}>Default Theme</label>
                <input placeholder="e.g. Technology, Business…" style={inp} />
              </div>
              <button style={{ ...priBtn, width:"fit-content" }}>Save Changes</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Studio Page (core app) ───────────────────────────────────────────────────
function Steps({ current }) {
  const steps = ["Theme & Topics", "Select Topic", "Generate Episode"];
  return (
    <div style={{ display:"flex", alignItems:"flex-start" }}>
      {steps.map((s, i) => {
        const done = i < current, active = i === current;
        return (
          <div key={s} style={{ display:"flex", alignItems:"flex-start" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
              <div style={{ width:32, height:32, borderRadius:"50%", background:done?"#10b981":active?"linear-gradient(135deg,#6366f1,#8b5cf6)":"rgba(255,255,255,0.05)", border:active?"2px solid rgba(139,92,246,0.6)":done?"2px solid #10b981":"2px solid rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:700, color:(done||active)?"#fff":"rgba(255,255,255,0.2)", boxShadow:active?"0 0 20px rgba(139,92,246,0.4)":"none", transition:"all .3s" }}>
                {done ? <Check s={13}/> : i+1}
              </div>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.05em", color:active?"#a5b4fc":done?"#6ee7b7":"rgba(255,255,255,0.2)", textTransform:"uppercase", whiteSpace:"nowrap" }}>{s}</span>
            </div>
            {i < steps.length-1 && <div style={{ width:72, height:2, marginTop:14, margin:"14px 10px 0", background:done?"linear-gradient(90deg,#10b981,#6366f1)":"rgba(255,255,255,0.06)", borderRadius:2, transition:"all .4s" }} />}
          </div>
        );
      })}
    </div>
  );
}

function ThemePanel({ onNext }) {
  const [theme, setTheme] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [topics, setTopics] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selected, setSelected] = useState("");
  const suggestions = ["True Crime", "Startup Stories", "Science & Space", "Mental Health", "AI & Tech", "History"];

  async function handleGenerate() {
    if (!theme.trim()) { setError("Please enter a theme first."); return; }
    setError(""); setLoading(true); setTopics([]); setSelected("");
    try { const d = await generateTopics(theme.trim()); setTopics(d.topics||[]); }
    catch(e) { setError(e.message); } finally { setLoading(false); }
  }

  async function handleMore() {
    setError(""); setLoadingMore(true);
    try { const d = await generateTopics(theme.trim(), true); setTopics(p => [...new Set([...p,...(d.topics||[])])]); }
    catch(e) { setError(e.message); } finally { setLoadingMore(false); }
  }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:28 }}>
      <div>
        <label style={{ ...lbl, display:"block", marginBottom:10 }}>Podcast Theme</label>
        <input value={theme} onChange={e => setTheme(e.target.value)} onKeyDown={e => e.key==="Enter"&&handleGenerate()} placeholder="e.g. Artificial Intelligence, True Crime, Space Exploration…" style={{ ...inp, padding:"15px 20px", fontSize:15, borderRadius:12 }} />
        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:12 }}>
          {suggestions.map(s => <button key={s} onClick={() => setTheme(s)} style={{ background:theme===s?"rgba(99,102,241,0.2)":"rgba(255,255,255,0.04)", border:`1px solid ${theme===s?"rgba(99,102,241,0.5)":"rgba(255,255,255,0.08)"}`, borderRadius:20, padding:"6px 16px", fontSize:12.5, color:theme===s?"#c7d2fe":"rgba(255,255,255,0.4)", cursor:"pointer", fontFamily:"inherit", transition:"all .2s" }}>{s}</button>)}
        </div>
      </div>
      {error && <div style={errBox}>{error}</div>}
      <button onClick={handleGenerate} disabled={loading} style={{ ...priBtn, padding:"15px 28px", fontSize:15 }}>
        {loading ? <><Spin />&nbsp;Generating Ideas…</> : "✦ Generate Topic Ideas"}
      </button>
      {topics.length > 0 && (
        <div style={{ display:"flex", flexDirection:"column", gap:11, animation:"fadeIn .4s ease" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:2 }}>
            <span style={{ ...lbl }}>Choose a topic</span>
            <span style={{ fontSize:11, color:"rgba(255,255,255,0.25)" }}>{topics.length} ideas</span>
          </div>
          {topics.map((t, i) => (
            <button key={i} onClick={() => setSelected(t)} style={{ background:selected===t?"rgba(99,102,241,0.12)":"rgba(255,255,255,0.03)", border:`1px solid ${selected===t?"rgba(99,102,241,0.45)":"rgba(255,255,255,0.07)"}`, borderRadius:13, padding:"16px 20px", textAlign:"left", cursor:"pointer", fontFamily:"inherit", display:"flex", alignItems:"center", gap:16, transition:"all .2s" }}>
              <div style={{ width:32, height:32, borderRadius:"50%", flexShrink:0, background:selected===t?"linear-gradient(135deg,#6366f1,#8b5cf6)":"rgba(255,255,255,0.05)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, color:selected===t?"#fff":"rgba(255,255,255,0.25)" }}>{i+1}</div>
              <span style={{ fontSize:14.5, color:selected===t?"#e0e7ff":"rgba(255,255,255,0.72)", lineHeight:1.5, fontWeight:500, flex:1 }}>{t}</span>
              {selected===t && <span style={{ color:"#818cf8", fontSize:18, flexShrink:0 }}>✓</span>}
            </button>
          ))}
          <button onClick={handleMore} disabled={loadingMore} style={{ ...ghostBtn, padding:"12px 20px" }}>{loadingMore ? <><Spin />&nbsp;Loading…</> : "+ Generate More Ideas"}</button>
          {selected && <button onClick={() => onNext(theme, selected)} style={{ ...priBtn, background:"linear-gradient(135deg,#059669,#10b981)", boxShadow:"0 4px 24px rgba(16,185,129,0.28)", padding:"15px 28px", fontSize:15 }}>Continue with this Topic →</button>}
        </div>
      )}
    </div>
  );
}

function PodcastPanel({ theme, topic, onReset }) {
  const [podcast, setPodcast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("outline");
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setError(""); setLoading(true);
    try { const d = await generateFullPodcast(theme, topic); setPodcast(d); }
    catch(e) { setError(e.message); } finally { setLoading(false); }
  }

  function handleCopy() { navigator.clipboard.writeText(podcast?.script||""); setCopied(true); setTimeout(()=>setCopied(false),2000); }
  function handleDownload() { const el=document.createElement("a"); el.href="data:text/plain;charset=utf-8,"+encodeURIComponent(podcast?.script||""); el.download=`podcast-${Date.now()}.txt`; el.click(); }

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
      <div style={{ background:"linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.07))", border:"1px solid rgba(99,102,241,0.2)", borderRadius:14, padding:"18px 22px" }}>
        <div style={{ fontSize:10, textTransform:"uppercase", letterSpacing:"0.12em", color:"#818cf8", marginBottom:6, fontWeight:700 }}>Selected Episode</div>
        <div style={{ fontSize:17, fontWeight:700, color:"#e0e7ff", lineHeight:1.4 }}>{topic}</div>
        <div style={{ fontSize:12.5, color:"rgba(255,255,255,0.35)", marginTop:4 }}>Theme: {theme}</div>
      </div>
      {error && <div style={errBox}>{error}</div>}
      {!podcast ? (
        <button onClick={handleGenerate} disabled={loading} style={{ ...priBtn, minHeight:56, padding:"16px 28px", fontSize:15 }}>
          {loading ? (
            <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:12 }}>
              <div style={{ display:"flex",alignItems:"center",gap:10 }}><Spin/><span>Building your episode…</span></div>
              <span style={{ fontSize:11.5,opacity:.5 }}>Topic → Outline → Script → Safety check</span>
            </div>
          ) : <><Mic s={16}/>&nbsp;Generate Full Podcast Episode</>}
        </button>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:20, animation:"fadeIn .4s ease" }}>
          <div style={{ display:"flex", background:"rgba(255,255,255,0.04)", borderRadius:12, padding:5, gap:4 }}>
            {["outline","script"].map(tab => <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex:1, padding:"11px 0", borderRadius:9, border:"none", background:activeTab===tab?"rgba(99,102,241,0.28)":"transparent", color:activeTab===tab?"#c7d2fe":"rgba(255,255,255,0.35)", fontWeight:700, fontSize:13.5, cursor:"pointer", fontFamily:"inherit", transition:"all .2s" }}>{tab==="outline"?"📋 Outline":"📝 Full Script"}</button>)}
          </div>
          {/* Large desktop script area */}
          <div style={{ background:"rgba(0,0,0,0.28)", borderRadius:14, border:"1px solid rgba(255,255,255,0.07)", padding:"24px 28px", height:"76vh", maxHeight:860, overflowY:"auto", fontSize:14.5, color:"rgba(255,255,255,0.82)", lineHeight:1.9, whiteSpace:"pre-wrap", fontFamily:activeTab==="script"?"'Courier New',monospace":"inherit" }}>
            {activeTab==="outline" ? podcast.outline : podcast.script}
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={handleCopy} style={{ ...ghostBtn, flex:1, padding:"12px 16px" }}><Copy/>{copied?"Copied!":"Copy Script"}</button>
            <button onClick={handleDownload} style={{ ...ghostBtn, flex:1, padding:"12px 16px" }}><Download/> Download .txt</button>
            <button onClick={handleGenerate} disabled={loading} style={{ ...ghostBtn, flex:1, padding:"12px 16px" }}><Refresh/> Regenerate</button>
          </div>
          <button onClick={onReset} style={{ ...ghostBtn, color:"rgba(255,255,255,0.3)", borderColor:"rgba(255,255,255,0.06)" }}>← Start New Episode</button>
        </div>
      )}
    </div>
  );
}

function ChatSidebar({ visible, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const quickQ = ["Suggest an episode hook","Improve transitions","Write a 30s teaser","B-roll idea for this topic"];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:"smooth" }); }, [messages]);

  async function send(msg) {
    const text = (msg||input).trim(); if(!text) return;
    setInput(""); setMessages(p=>[...p,{role:"user",text}]); setLoading(true);
    try {
      const d = await generalChat(text);
      setMessages(p=>[...p,{role:"ai",text:d.response || d.message || "Sorry, I couldn't generate a response."}]);
    }
    catch (e) {
      setMessages(p=>[...p,{role:"ai",text:e.message || "Connection error — is the backend running?"}]);
    }
    setLoading(false);
  }

  return (
    <div style={{ position:"fixed", top:64, right:0, bottom:0, width:visible?360:0, overflow:"hidden", background:"rgba(6,8,18,0.97)", borderLeft:"1px solid rgba(255,255,255,0.07)", backdropFilter:"blur(24px)", transition:"width .32s cubic-bezier(0.4,0,0.2,1)", display:"flex", flexDirection:"column", zIndex:100 }}>
      <div style={{ padding:"18px 18px 14px", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
        <div>
          <div style={{ fontWeight:800, fontSize:14, color:"#fff" }}>AI Assistant</div>
          <div style={{ fontSize:11, color:"#10b981", marginTop:2, display:"flex", alignItems:"center", gap:5 }}><span style={{ width:5,height:5,borderRadius:"50%",background:"#10b981",display:"inline-block" }}/>Online</div>
        </div>
        <button onClick={onClose} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:8, width:30, height:30, cursor:"pointer", color:"rgba(255,255,255,0.5)", fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center" }}><X/></button>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 8px", display:"flex", flexDirection:"column", gap:10 }}>
        {messages.length === 0 && (
          <div style={{ textAlign:"center", padding:"28px 8px" }}>
            <div style={{ fontSize:30, marginBottom:10 }}>🎙️</div>
            <div style={{ color:"rgba(255,255,255,0.35)", fontSize:12, lineHeight:1.7, marginBottom:18 }}>Ask me anything — hooks, transitions, content ideas, scripting tips…</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:7 }}>
              {quickQ.map(q => <button key={q} onClick={()=>send(q)} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, padding:"9px", fontSize:11, color:"rgba(255,255,255,0.5)", cursor:"pointer", fontFamily:"inherit", lineHeight:1.4, textAlign:"left", transition:"all .2s" }}>{q}</button>)}
            </div>
          </div>
        )}
        {messages.map((m,i) => (
          <div key={i} style={{ display:"flex", justifyContent:m.role==="user"?"flex-end":"flex-start" }}>
            <div style={{ maxWidth:"82%", padding:"10px 14px", borderRadius:m.role==="user"?"14px 14px 3px 14px":"14px 14px 14px 3px", background:m.role==="user"?"linear-gradient(135deg,#6366f1,#8b5cf6)":"rgba(255,255,255,0.06)", border:m.role==="ai"?"1px solid rgba(255,255,255,0.08)":"none", fontSize:13, color:"#fff", lineHeight:1.6 }}>{m.text}</div>
          </div>
        ))}
        {loading && <div style={{ display:"flex" }}><div style={{ background:"rgba(255,255,255,0.06)", borderRadius:"14px 14px 14px 3px", padding:"12px 16px", display:"flex", gap:4 }}>{[0,1,2].map(i=><span key={i} style={{ width:5,height:5,borderRadius:"50%",background:"#6366f1",display:"inline-block",animation:"bounce 1s infinite",animationDelay:`${i*.15}s` }}/>)}</div></div>}
        <div ref={bottomRef}/>
      </div>
      <div style={{ padding:"10px 14px 16px", borderTop:"1px solid rgba(255,255,255,0.07)", flexShrink:0 }}>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&!loading&&send()} placeholder="Ask about your podcast…" disabled={loading} style={{ ...inp, fontSize:13, padding:"10px 14px", flex:1 }}/>
          <button onClick={()=>send()} disabled={loading||!input.trim()} style={{ ...priBtn, padding:"10px 14px", width:"auto", flexShrink:0, opacity:(!input.trim()||loading)?0.35:1 }}><Send/></button>
        </div>
      </div>
    </div>
  );
}

function Studio({ user, setPage }) {
  const [step, setStep] = useState(0);
  const [theme, setTheme] = useState("");
  const [topic, setTopic] = useState("");
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div style={{ paddingTop:64, display:"flex", minHeight:"100vh" }}>
      {/* Sidebar */}
      <aside style={{ width:240, flexShrink:0, borderRight:"1px solid rgba(255,255,255,0.06)", padding:"36px 0", position:"fixed", top:64, bottom:0, left:0, overflow:"auto", background:"rgba(6,8,18,0.75)", backdropFilter:"blur(16px)" }}>
        <div style={{ padding:"0 20px", marginBottom:28 }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.25)", marginBottom:14 }}>Studio</div>
          {[
            {label:"New Episode", icon:"✨", action:()=>{setStep(0);setTheme("");setTopic("");}},
            {label:"My Episodes",  icon:"📚", action:()=>setPage("account")},
            {label:"AI Assistant", icon:"💬", action:()=>setChatOpen(o=>!o)},
          ].map((item,i)=>(
            <button key={i} onClick={item.action} style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"11px 14px", borderRadius:10, border:"none", background:i===2&&chatOpen?"rgba(99,102,241,0.15)":"none", color:i===2&&chatOpen?"#c7d2fe":"rgba(255,255,255,0.6)", fontSize:13.5, fontWeight:600, cursor:"pointer", fontFamily:"inherit", transition:"all .2s", marginBottom:3 }}>
              <span style={{ fontSize:16 }}>{item.icon}</span>{item.label}
            </button>
          ))}
        </div>

        <div style={{ padding:"20px 20px 0", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:"rgba(255,255,255,0.25)", marginBottom:14 }}>AI Pipeline</div>
          {[
            {label:"Topic Agent",   color:"#6366f1", active: step >= 0},
            {label:"Outline Agent", color:"#8b5cf6", active: step >= 1},
            {label:"Script Agent",  color:"#06b6d4", active: step >= 1},
            {label:"Safety Agent",  color:"#10b981", active: step >= 1},
          ].map((a,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 14px", borderRadius:9, marginBottom:3, background:a.active?"rgba(255,255,255,0.03)":"none" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:a.active?a.color:"rgba(255,255,255,0.12)", flexShrink:0, boxShadow:a.active?`0 0 6px ${a.color}`:"none", transition:"all .4s" }}/>
              <span style={{ fontSize:12.5, color:a.active?"rgba(255,255,255,0.65)":"rgba(255,255,255,0.3)", fontWeight:500 }}>{a.label}</span>
              {a.active && <span style={{ marginLeft:"auto", fontSize:10, color:a.color, fontWeight:700 }}>●</span>}
            </div>
          ))}
        </div>
      </aside>

      {/* Main — wide desktop layout */}
      <main style={{ flex:1, marginLeft:240, marginRight:chatOpen?380:0, transition:"margin-right .32s cubic-bezier(0.4,0,0.2,1)", padding:"56px 88px", minHeight:"calc(100vh - 64px)" }}>
        {!user && (
          <div style={{ background:"rgba(245,158,11,0.07)", border:"1px solid rgba(245,158,11,0.22)", borderRadius:12, padding:"13px 20px", marginBottom:32, display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
            <span style={{ fontSize:13.5, color:"rgba(245,158,11,0.85)" }}>⚡ You're in guest mode. <strong>Sign in</strong> to save your episodes.</span>
            <button onClick={()=>setPage("login")} style={{ ...ghostBtn, padding:"7px 16px", fontSize:12, flexShrink:0, borderColor:"rgba(245,158,11,0.3)", color:"rgba(245,158,11,0.85)" }}>Sign In</button>
          </div>
        )}

        {/* Header row */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:40 }}>
          <div>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.3)", marginBottom:8 }}>Episode Builder</div>
            <Steps current={step} />
          </div>
          <button onClick={()=>setChatOpen(o=>!o)} style={{ ...ghostBtn, padding:"10px 20px", background:chatOpen?"rgba(99,102,241,0.15)":"rgba(255,255,255,0.05)", borderColor:chatOpen?"rgba(99,102,241,0.4)":"rgba(255,255,255,0.1)", color:chatOpen?"#c7d2fe":"rgba(255,255,255,0.6)" }}>💬 AI Assistant</button>
        </div>

        {/* Two-column layout: left = form, right = live preview */}
        <div style={{ display:"grid", gridTemplateColumns: step===0 ? "minmax(760px, 1fr) 380px" : "1fr", gap:24, alignItems:"start" }}>
          {/* Main card */}
          <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:20, padding:"44px 48px", boxShadow:"0 32px 80px rgba(0,0,0,0.4)" }}>
            {step===0 && <ThemePanel onNext={(t,top)=>{setTheme(t);setTopic(top);setStep(1);}}/>}
            {step===1 && <PodcastPanel theme={theme} topic={topic} onReset={()=>{setTheme("");setTopic("");setStep(0);}}/>}
          </div>

          {/* Right panel: tips when on step 0, agent info when on step 1 */}
          {step===0 && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div style={{ background:"rgba(99,102,241,0.08)", border:"1px solid rgba(99,102,241,0.2)", borderRadius:16, padding:"24px 24px" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#a5b4fc", marginBottom:14 }}>💡 Theme Tips</div>
                {["Be specific — 'B2B SaaS Sales' beats 'Business'","Think about your target listener's pain point","Combine two interests for a unique niche","Seasonal or trending topics perform well"].map((t,i)=>(
                  <div key={i} style={{ display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:"#818cf8", flexShrink:0, marginTop:6 }}/>
                    <span style={{ fontSize:13, color:"rgba(255,255,255,0.6)", lineHeight:1.6 }}>{t}</span>
                  </div>
                ))}
              </div>
              <div style={{ background:"rgba(16,185,129,0.07)", border:"1px solid rgba(16,185,129,0.18)", borderRadius:16, padding:"24px 24px" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"#6ee7b7", marginBottom:14 }}>🚀 Popular Themes This Week</div>
                {["AI & the Future of Work","Minimalist Living","Personal Finance for Gen Z","Climate Tech Startups"].map((t,i)=>(
                  <div key={i} style={{ fontSize:13, color:"rgba(255,255,255,0.55)", padding:"7px 0", borderBottom:i<3?"1px solid rgba(255,255,255,0.05)":"none" }}>{t}</div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Agent strip */}
        <div style={{ display:"flex", gap:8, marginTop:28, alignItems:"center" }}>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.2)", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginRight:4 }}>Pipeline:</span>
          {["Topic Agent","Outline Agent","Script Agent","Safety Agent"].map((a,i,arr)=>(
            <div key={a} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, padding:"5px 14px", fontSize:11, color:"rgba(255,255,255,0.3)", fontWeight:600 }}>{a}</div>
              {i<arr.length-1 && <span style={{ color:"rgba(255,255,255,0.1)", fontSize:12 }}>→</span>}
            </div>
          ))}
        </div>
      </main>

      <ChatSidebar visible={chatOpen} onClose={()=>setChatOpen(false)}/>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html, body, #root { min-height:100vh; }
        body { font-family:'Sora',system-ui,sans-serif; background:#06080f; color:#fff; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:4px; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes slowSpin { to { transform:translate(-50%,-50%) rotate(360deg); } }
        @keyframes floatY { 0%{transform:translateY(0px)} 100%{transform:translateY(-18px)} }
        @keyframes floatOrb { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(30px,20px) scale(1.1)} }
        @keyframes waveBar { 0%{transform:scaleY(0.4)} 100%{transform:scaleY(1)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes subtlePulse { 0%,100%{box-shadow:0 8px 40px rgba(99,102,241,0.45)} 50%{box-shadow:0 8px 56px rgba(99,102,241,0.65)} }
        input:focus { border-color:rgba(99,102,241,0.6) !important; box-shadow:0 0 0 3px rgba(99,102,241,0.1) !important; }
        button:not([disabled]):hover { filter:brightness(1.08); }
        button[disabled] { cursor:not-allowed; }
        section { max-width:1280px; margin-left:auto; margin-right:auto; }
      `}</style>

      {/* Background */}
      <div style={{ position:"fixed", inset:0, zIndex:0, overflow:"hidden", pointerEvents:"none" }}>
        <div style={{ position:"absolute", top:"-20%", left:"-5%", width:800, height:800, borderRadius:"50%", background:"radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 60%)" }}/>
        <div style={{ position:"absolute", bottom:"-15%", right:"-5%", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 60%)" }}/>
        <div style={{ position:"absolute", top:"50%", left:"50%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(16,185,129,0.04) 0%,transparent 60%)" }}/>
      </div>

      <div style={{ position:"relative", zIndex:1, minHeight:"100vh" }}>
        <Nav page={page} setPage={setPage} user={user} setUser={setUser}/>
        {page==="landing"       && <Landing    setPage={setPage}/>}
        {page==="features"      && <Features   setPage={setPage}/>}
        {page==="how-it-works"  && <HowItWorks setPage={setPage}/>}
        {page==="pricing"       && <Pricing    setPage={setPage} setUser={setUser}/>}
        {page==="login"         && <Login      setPage={setPage} setUser={setUser}/>}
        {page==="account"       && (user ? <Account user={user} setPage={setPage}/> : <Login setPage={setPage} setUser={setUser}/>)}
        {page==="studio"        && <Studio     user={user} setPage={setPage}/>}
      </div>
    </>
  );
}
