import { useState, useEffect, useRef } from "react";

const LOGO = "https://i.imgur.com/SWNd8hL.png";
const ALINA_FOTO = "https://i.imgur.com/T3OCg2m.jpeg";

const C = {
  forest: "#1b4332", green: "#2d6a4f", greenMid: "#40916c", greenLight: "#52b788",
  greenPale: "#d8f3dc", greenFaint: "#f0faf4", cream: "#fffdf7",
  accent: "#e76f51", accentSoft: "#fce8e2", text: "#1a1a2e", textMed: "#3d4550", textLight: "#6b7280",
  border: "#e5e7eb", borderLight: "#f3f4f6",
};

function calcEG(a) {
  const b = a.einkommen_pt1 || 2000;
  const eg = Math.max(300, Math.min(Math.round(b * 0.60 * 0.67), 1800));
  const tipps = [];
  if (a.geschwister === "ja") tipps.push({ icon: "👶", title: "Geschwisterbonus", text: "Mit älterem Geschwister gibt es einen monatlichen Zuschlag!" });
  if (a.arbeitsmodell_first === "selbstaendig") tipps.push({ icon: "📊", title: "Gewinnermittlung", text: "Bei Selbstständigen zählt der Gewinn der letzten 12 Monate." });
  if (tipps.length === 0) tipps.push({ icon: "🎯", title: "Individuelle Analyse", text: "Jede Situation ist anders. Im Gespräch finden wir die beste Lösung." });
  return { eg: eg, opt: eg, diff: (eg * 14) - (eg * 12), tipps: tipps };
}

function Bot({ children, delay }) {
  const [show, setShow] = useState(!delay);
  useEffect(() => { if (delay) setTimeout(() => setShow(true), delay); }, [delay]);
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", opacity: show ? 1 : 0, transition: "opacity 0.3s" }}>
      <img src={ALINA_FOTO} alt="Alina" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", objectPosition: "center 30%", flexShrink: 0 }} />
      <div style={{ background: C.borderLight, borderRadius: "4px 14px 14px 14px", padding: "11px 15px", fontSize: 14.5, lineHeight: 1.55, maxWidth: "82%", color: C.text }}>
        {show ? children : "..."}
      </div>
    </div>
  );
}

function User({ text }) {
  return <div style={{ display: "flex", justifyContent: "flex-end" }}><div style={{ background: C.green, color: "#fff", borderRadius: "14px 4px 14px 14px", padding: "10px 15px", fontSize: 14.5 }}>{text}</div></div>;
}

function Btn({ label, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ border: "2px solid " + (h ? C.greenMid : C.green), background: h ? C.green : "#fff", color: h ? "#fff" : C.green, borderRadius: 10, padding: "9px 16px", fontSize: 13.5, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", transition: "all .18s" }}>
      {label}
    </button>
  );
}

function PhoneGate({ onSubmit, loading }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [time, setTime] = useState("");
  
  const submit = (e) => {
    e.preventDefault();
    if (name.trim() && email.trim() && phone.trim() && time) {
      onSubmit(name.trim(), email.trim(), phone.trim(), time);
    }
  };
  
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid " + C.green, padding: 24, margin: "8px 0" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📞</div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.forest, margin: "0 0 6px" }}>Andrea ruft dich an!</h3>
        <p style={{ fontSize: 13.5, color: C.textMed }}>Trag deine Kontaktdaten ein.</p>
      </div>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input type="text" placeholder="Vorname" value={name} onChange={(e) => setName(e.target.value)} style={{ border: "1.5px solid " + C.border, borderRadius: 10, padding: "11px 14px", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
        <input type="email" placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} style={{ border: "1.5px solid " + C.border, borderRadius: 10, padding: "11px 14px", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
        <input type="tel" placeholder="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ border: "1.5px solid " + C.border, borderRadius: 10, padding: "11px 14px", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
        <select value={time} onChange={(e) => setTime(e.target.value)} style={{ border: "1.5px solid " + C.border, borderRadius: 10, padding: "11px 14px", fontSize: 14, fontFamily: "inherit", outline: "none" }}>
          <option value="">Wann erreichbar?</option>
          <option value="09-12">9-12 Uhr</option>
          <option value="12-15">12-15 Uhr</option>
          <option value="15-18">15-18 Uhr</option>
          <option value="18-20">18-20 Uhr</option>
        </select>
        <button type="submit" disabled={loading} style={{ background: "linear-gradient(135deg," + C.green + "," + C.greenMid + ")", color: "#fff", border: "none", borderRadius: 10, padding: "13px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
          {loading ? "Wird verarbeitet..." : "Andrea soll mich anrufen →"}
        </button>
      </form>
    </div>
  );
}

function Result({ result, userName, arbeitsmodell_first }) {
  const price = arbeitsmodell_first === "angestellt" ? 297 : 397;
  return (
    <div style={{ background: C.cream, borderRadius: 14, border: "1px solid " + C.border, padding: 20, margin: "8px 0" }}>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.forest, margin: "0 0 16px" }}>📊 Dein Ergebnis</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div style={{ border: "1px solid " + C.border, borderRadius: 10, padding: 14, background: "#fff" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textLight }}>OHNE</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>{result.eg}€</div>
        </div>
        <div style={{ border: "1.5px solid " + C.green, borderRadius: 10, padding: 14, background: C.greenFaint }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.green }}>MIT</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.green, marginTop: 4 }}>{result.opt}€</div>
        </div>
      </div>
      <div style={{ background: C.accentSoft, borderLeft: "3px solid " + C.accent, padding: 12, marginBottom: 12, fontSize: 13 }}>
        <strong>💰 Paket:</strong> {price}€. Andrea erklärt dir alles.
      </div>
    </div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [msgs, setMsgs] = useState([]);
  const [showOpts, setShowOpts] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [started, setStarted] = useState(false);
  const [gated, setGated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uName, setUName] = useState("");
  const [showRes, setShowRes] = useState(false);
  const chatRef = useRef(null);

  const FLOW = [
    { id: "welcome", bot: ["Hey! Ich bin Alina.", "In 2 Minuten zeige ich dir, wie viel Elterngeld dir zusteht."], type: "start" },
    { id: "arbeitsmodell_first", bot: ["Bist du angestellt oder selbständig?"], type: "select", options: [{ label: "Angestellt", value: "angestellt" }, { label: "Selbständig", value: "selbstaendig" }] },
    { id: "geburtstermin", bot: ["Geburtstermin?"], type: "date" },
    { id: "einkommen_pt1", bot: ["Dein Brutto-Einkommen?"], type: "select", options: [{ label: "Unter 1.500€", value: 1200 }, { label: "1.500-2.500€", value: 2000 }, { label: "2.500-3.500€", value: 3000 }, { label: "3.500-4.500€", value: 4000 }, { label: "Über 4.500€", value: 5000 }] },
    { id: "einkommen_pt2", bot: ["Partner Einkommen?"], type: "select", options: [{ label: "Nein", value: 0 }, { label: "Unter 1.500€", value: 1200 }, { label: "1.500-2.500€", value: 2000 }, { label: "2.500-3.500€", value: 3000 }, { label: "3.500-4.500€", value: 4000 }, { label: "Über 4.500€", value: 5000 }] },
    { id: "geschwister", bot: ["Gibt es Geschwister?"], type: "select", options: [{ label: "Ja", value: "ja" }, { label: "Nein", value: "nein" }] },
    { id: "besonderheiten", bot: ["Besonderheiten?"], type: "text" },
    { id: "phonegate", bot: ["Super! Dein Ergebnis ist fertig.", "Trag deine Nummer ein."], type: "phonegate" },
  ];

  const cur = FLOW[step];
  const result = gated ? calcEG(answers) : null;

  useEffect(() => {
    if (!cur) return;
    const nm = [];
    for (let i = 0; i < cur.bot.length; i++) {
      nm.push({ from: "bot", text: cur.bot[i], delay: i * 600 + 200, id: step + "-b-" + i });
    }
    setMsgs(p => p.concat(nm));
    setTimeout(() => setShowOpts(true), cur.bot.length * 600 + 400);
  }, [step, cur]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, showOpts, showRes, gated]);

  const answer = (display, value) => {
    setShowOpts(false);
    setMsgs(p => p.concat([{ from: "user", text: display, id: step + "-u" }]));
    setAnswers({ ...answers, [cur.id]: value });
    setTimeout(() => setStep(step + 1), 300);
  };

  const onDate = (e) => {
    e.preventDefault();
    if (inputVal) { answer(inputVal, inputVal); setInputVal(""); }
  };

  const onTextInput = (e) => {
    e.preventDefault();
    if (inputVal.trim()) { answer(inputVal.trim(), inputVal.trim()); setInputVal(""); }
  };

  const onPhone = (firstName, email, phone, time) => {
    setSubmitting(true);
    setUName(firstName);
    const r = calcEG(answers);
    fetch("/api/submit-to-sheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        name: firstName, email, phone, callTime: time,
        arbeitsmodell: answers.arbeitsmodell_first,
        geburtstermin: answers.geburtstermin || "",
        einkommen_pt1: answers.einkommen_pt1 || "",
        einkommen_pt2: answers.einkommen_pt2 || "",
        geschwister: answers.geschwister || "",
        besonderheiten: answers.besonderheiten || "",
        elterngeld_ohne: r.eg, elterngeld_mit: r.opt, elterngeld_diff: r.diff,
        price: answers.arbeitsmodell_first === "angestellt" ? 297 : 397
      })
    }).catch(console.log);
    setMsgs(p => p.concat([{ from: "user", text: firstName + " — " + email, id: "phone-u" }]));
    setTimeout(() => {
      setGated(true);
      setSubmitting(false);
      setShowOpts(false);
      setMsgs(p => p.concat([{ from: "bot", text: firstName + ", hier ist dein Ergebnis:", delay: 300, id: "res-b" }]));
      setTimeout(() => setShowRes(true), 800);
    }, 600);
  };

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", color: C.text, background: C.cream, minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');*{box-sizing:border-box;margin:0;padding:0}a{color:${C.green}}`}</style>

      <nav style={{ background: "#fff", borderBottom: "1px solid " + C.border, padding: "8px 16px", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={LOGO} alt="Zwergengruppe" style={{ height: 28 }} />
            <div><div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 15, color: C.forest }}>Zwergengruppe</div></div>
          </div>
        </div>
      </nav>

      <section style={{ maxWidth: 720, margin: "0 auto", padding: "20px 20px 12px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(22px,5vw,36px)", fontWeight: 700, color: C.forest }}>Verschenkst du <span style={{ color: C.accent }}>tausende Euro</span> Elterngeld?</h1>
        <p style={{ fontSize: 14, color: C.textMed, marginTop: 8 }}>Beantworte 5 kurze Fragen und erfahre sofort, wie viel dir zusteht.</p>
      </section>

      {!started ? (
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 16px" }}>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid " + C.border, padding: "20px 24px", textAlign: "center" }}>
            <img src={ALINA_FOTO} alt="Alina" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", objectPosition: "center 30%", marginBottom: 8 }} />
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.forest }}>Elterngeld-Schnellcheck</h2>
            <p style={{ fontSize: 13, color: C.textMed, margin: "8px 0 16px" }}>5 Fragen · 2 Minuten · Sofort dein Ergebnis</p>
            <button onClick={() => setStarted(true)} style={{ background: "linear-gradient(135deg," + C.green + "," + C.greenMid + ")", color: "#fff", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
              Schnellcheck starten →
            </button>
          </div>
        </section>
      ) : (
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 24px" }}>
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid " + C.border, overflow: "hidden" }}>
            <div ref={chatRef} style={{ padding: "20px 18px", overflowY: "auto", maxHeight: "58vh", display: "flex", flexDirection: "column", gap: 8 }}>
              {msgs.map(m => m.from === "bot" ? <Bot key={m.id} delay={m.delay}>{m.text}</Bot> : <User key={m.id} text={m.text} />)}
              {showOpts && cur?.type === "phonegate" && !gated && <PhoneGate onSubmit={onPhone} loading={submitting} />}
              {showRes && result && <Result result={result} answers={answers} userName={uName} arbeitsmodell_first={answers.arbeitsmodell_first} />}
            </div>
            {showOpts && cur && cur.type !== "phonegate" && !gated && (
              <div style={{ borderTop: "1px solid " + C.border, padding: "14px 18px", background: C.greenFaint }}>
                {cur.type === "start" && <Btn label="Los geht's! 🚀" onClick={() => answer("Los geht's!", true)} />}
                {cur.type === "date" && <form onSubmit={onDate} style={{ display: "flex", gap: 8 }}><input type="date" value={inputVal} onChange={(e) => setInputVal(e.target.value)} style={{ flex: 1, border: "2px solid " + C.border, borderRadius: 10, padding: "9px 12px", fontSize: 14, fontFamily: "inherit" }} /><button type="submit" style={{ width: 42, height: 42, borderRadius: 10, border: "none", background: C.green, color: "#fff", cursor: "pointer" }}>→</button></form>}
                {cur.type === "text" && <form onSubmit={onTextInput} style={{ display: "flex", gap: 8 }}><input type="text" placeholder="Antwort..." value={inputVal} onChange={(e) => setInputVal(e.target.value)} style={{ flex: 1, border: "2px solid " + C.border, borderRadius: 10, padding: "9px 12px", fontSize: 14, fontFamily: "inherit" }} /><button type="submit" style={{ width: 42, height: 42, borderRadius: 10, border: "none", background: C.green, color: "#fff", cursor: "pointer" }}>→</button></form>}
                {cur.type === "select" && <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{cur.options.map(o => <Btn key={o.value} label={o.label} onClick={() => answer(o.label, o.value)} />)}</div>}
              </div>
            )}
          </div>
        </section>
      )}

      {/* LANDING PAGE - IDENTISCH */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "36px 20px" }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: C.forest, textAlign: "center", marginBottom: 24 }}>Das haben andere Familien erreicht</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
          {[
            { name: "Melanie & Tom", sit: "Steuerklasse V → III", v: "640€", n: "1.180€", d: "+6.480€", q: "Ohne Alina hätten wir über 6.000€ verschenkt!" },
            { name: "Sarah", sit: "Selbstständig", v: "890€", n: "1.420€", d: "+9.460€", q: "Die Beratung hat sich 30x bezahlt gemacht." },
            { name: "Lisa & Jan", sit: "Partnerschaftsbonus", v: "1.100€", n: "1.100€+4M", d: "+4.400€", q: "Alina hat alles durchgerechnet." },
            { name: "Julia & Marco", sit: "Selbstständig nebenberuflich", v: "720€", n: "1.240€", d: "+7.840€", q: "Alina hat alles so erklärt, dass wir keine Sorgen mehr hatten." },
          ].map((c, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid " + C.border, padding: 20 }}>
              <div><strong>{c.name}</strong><div style={{ fontSize: 12, color: C.textLight }}>{c.sit}</div></div>
              <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
                <div style={{ flex: 1, background: C.borderLight, borderRadius: 8, padding: "8px", textAlign: "center", fontSize: 13 }}><div style={{ fontSize: 10, color: C.textLight }}>VORHER</div>{c.v}</div>
                <div style={{ flex: 1, background: C.greenFaint, borderRadius: 8, padding: "8px", textAlign: "center", fontSize: 13, color: C.green }}><div style={{ fontSize: 10 }}>NACHHER</div>{c.n}</div>
              </div>
              <div style={{ background: C.greenFaint, borderRadius: 8, padding: "6px", textAlign: "center", fontSize: 12, color: C.green, fontWeight: 700, marginBottom: 8 }}>{c.d}</div>
              <p style={{ fontSize: 13, color: C.textMed, fontStyle: "italic" }}>"{c.q}"</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 720, margin: "0 auto", padding: "20px 20px 36px" }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid " + C.border, padding: 28 }}>
          <img src={ALINA_FOTO} alt="Alina" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", objectPosition: "center 30%", marginBottom: 12 }} />
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.forest }}>Alina Nußbaum</h3>
          <p style={{ fontSize: 13, color: C.green, fontWeight: 600, marginBottom: 10 }}>Elterngeld-Expertin · Wirtschaftswissenschaftlerin</p>
          <p style={{ fontSize: 13.5, color: C.textMed, lineHeight: 1.6 }}>Ich bringe tiefes Steuer- und Finanzwissen mit. Ich optimiere nicht nur euren Antrag, sondern verstehe, wie Steuerklasse und eure gesamte Situation zusammenspielen.</p>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid " + C.border, background: "#fff", padding: 20, textAlign: "center", fontSize: 12.5, color: C.textLight }}>
        <p>© 2026 Zwergengruppe · Elterngeld-Beratung mit Alina Nußbaum</p>
      </footer>
    </div>
  );
}
