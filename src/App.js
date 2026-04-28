import { useState, useEffect, useRef } from "react";

const CALENDLY = "https://calendly.com/zwergengruppe/zwergengruppe-kennenlerngesprach-1";
const LOGO = "https://i.imgur.com/SWNd8hL.png";
const ALINA_FOTO = "https://i.imgur.com/T3OCg2m.jpeg";

const C = {
  forest: "#1b4332", green: "#2d6a4f", greenMid: "#40916c", greenLight: "#52b788",
  greenPale: "#d8f3dc", greenFaint: "#f0faf4", cream: "#fffdf7",
  accent: "#e76f51", accentSoft: "#fce8e2", text: "#1a1a2e", textMed: "#3d4550", textLight: "#6b7280",
  border: "#e5e7eb", borderLight: "#f3f4f6",
};

function calcEG(a) {
  const egOhne = Math.max(300, Math.min(Math.round((a.einkommen_pt1 || 2000) * 0.60 * 0.67), 1800));
  const egMit = egOhne;
  const diff = (egMit * 14) - (egOhne * 12);
  
  const tipps = [];
  if (a.geschwister === "ja") tipps.push({ icon: "👶", title: "Geschwisterbonus", text: "Mit aelterem Geschwister gibt es einen monatlichen Zuschlag!" });
  if (a.arbeitsmodell_first === "selbstaendig") tipps.push({ icon: "📊", title: "Gewinnermittlung", text: "Der Gewinn der letzten 12 Monate zaehlt - richtige Gestaltung bringt mehr." });
  if (tipps.length === 0) tipps.push({ icon: "🎯", title: "Individuelle Analyse", text: "Jede Situation ist anders. Im Gespraech finden wir die beste Loesung." });
  
  return { eg: egOhne, opt: egMit, diff: diff, tipps: tipps };
}

function Bot({ children, delay }) {
  const [show, setShow] = useState(!delay);
  useEffect(() => { if (delay) setTimeout(() => setShow(true), delay); }, [delay]);
  
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", opacity: show ? 1 : 0, transition: "opacity 0.3s" }}>
      <img src={ALINA_FOTO} alt="Alina" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", objectPosition: "center 30%", flexShrink: 0 }} />
      <div style={{ background: C.borderLight, borderRadius: "4px 14px 14px 14px", padding: "11px 15px", fontSize: 14.5, lineHeight: 1.55, maxWidth: "82%", color: C.text }}>
        {show ? children : <div style={{ display: "flex", gap: 5 }}><div style={{ width: 7, height: 7, borderRadius: "50%", background: C.textLight }}></div><div style={{ width: 7, height: 7, borderRadius: "50%", background: C.textLight }}></div><div style={{ width: 7, height: 7, borderRadius: "50%", background: C.textLight }}></div></div>}
      </div>
    </div>
  );
}

function User({ text }) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div style={{ background: C.green, color: "#fff", borderRadius: "14px 4px 14px 14px", padding: "10px 15px", fontSize: 14.5, lineHeight: 1.5, maxWidth: "75%" }}>{text}</div>
    </div>
  );
}

function Btn({ label, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{ border: "2px solid " + (h ? C.greenMid : C.green), background: h ? C.green : "#fff", color: h ? "#fff" : C.green, borderRadius: 10, padding: "9px 16px", fontSize: 13.5, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", transition: "all .18s", whiteSpace: "nowrap" }}>
      {label}
    </button>
  );
}

function PhoneGate({ onSubmit, loading }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [time, setTime] = useState("");
  const [err, setErr] = useState("");
  
  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !time) { setErr("Alle Felder erforderlich."); return; }
    if (!email.includes("@")) { setErr("Gueltige E-Mail erforderlich."); return; }
    setErr("");
    onSubmit(name.trim(), email.trim(), phone.trim(), time);
  };
  
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid " + C.green, padding: 24, margin: "8px 0" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📞</div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.forest, margin: "0 0 6px" }}>Andrea ruft dich an!</h3>
        <p style={{ fontSize: 13.5, color: C.textMed, lineHeight: 1.5 }}>Trag deine Kontaktdaten ein und Andrea bespricht deine Situation mit dir.</p>
      </div>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input type="text" placeholder="Dein Vorname" value={name} onChange={(e) => setName(e.target.value)} style={{ border: "1.5px solid " + C.border, borderRadius: 10, padding: "11px 14px", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
        <input type="email" placeholder="Deine E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} style={{ border: "1.5px solid " + C.border, borderRadius: 10, padding: "11px 14px", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
        <input type="tel" placeholder="Telefonnummer" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ border: "1.5px solid " + C.border, borderRadius: 10, padding: "11px 14px", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
        <select value={time} onChange={(e) => setTime(e.target.value)} style={{ border: "1.5px solid " + C.border, borderRadius: 10, padding: "11px 14px", fontSize: 14, fontFamily: "inherit", outline: "none" }}>
          <option value="">Wann bist du erreichbar?</option>
          <option value="09-12">9-12 Uhr</option>
          <option value="12-15">12-15 Uhr</option>
          <option value="15-18">15-18 Uhr</option>
          <option value="18-20">18-20 Uhr</option>
        </select>
        {err && <p style={{ fontSize: 12, color: C.accent, margin: 0 }}>{err}</p>}
        <button type="submit" disabled={loading} style={{ background: "linear-gradient(135deg," + C.green + "," + C.greenMid + ")", color: "#fff", border: "none", borderRadius: 10, padding: "13px 20px", fontSize: 15, fontWeight: 700, cursor: loading ? "wait" : "pointer", fontFamily: "inherit" }}>
          {loading ? "Wird verarbeitet..." : "Andrea soll mich anrufen →"}
        </button>
      </form>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 12, fontSize: 11, color: C.textLight }}>
        <span>🔒 DSGVO-konform</span><span>Keine Spam</span>
      </div>
    </div>
  );
}

function Result({ result, userName, arbeitsmodell }) {
  const price = arbeitsmodell === "angestellt" ? 297 : 397;
  return (
    <div style={{ background: C.cream, borderRadius: 14, border: "1px solid " + C.border, padding: 20, margin: "8px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 24 }}>📊</span>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.forest, margin: 0 }}>Dein Elterngeld-Ergebnis</h3>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div style={{ border: "1px solid " + C.border, borderRadius: 10, padding: 14, background: "#fff" }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textLight }}>OHNE OPTIMIERUNG</div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display',serif", marginTop: 4 }}>{result.eg} EUR<span style={{ fontSize: 13, fontWeight: 400, color: C.textLight }}>/Monat</span></div>
        </div>
        <div style={{ border: "1.5px solid " + C.green, borderRadius: 10, padding: 14, background: C.greenFaint }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.green }}>MIT BERATUNG</div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display',serif", color: C.green, marginTop: 4 }}>{result.opt} EUR<span style={{ fontSize: 13, fontWeight: 400, color: C.greenMid }}>/Monat</span></div>
        </div>
      </div>
      {result.diff > 0 && <div style={{ background: "linear-gradient(135deg," + C.forest + "," + C.green + ")", color: "#fff", borderRadius: 10, padding: 14, marginBottom: 16 }}><strong>Bis zu {result.diff.toLocaleString("de-DE")} EUR mehr moeglich!</strong></div>}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.forest, marginBottom: 10 }}>Deine Optimierungshebel:</div>
        {result.tipps.map((t, i) => <div key={i} style={{ borderLeft: "3px solid " + C.green, paddingLeft: 12, marginBottom: 8 }}><strong>{t.icon} {t.title}</strong><p style={{ fontSize: 12.5, color: C.textMed, margin: "3px 0 0" }}>{t.text}</p></div>)}
      </div>
      <div style={{ background: C.accentSoft, borderLeft: "3px solid " + C.accent, padding: 12, marginBottom: 12, fontSize: 13 }}><strong>💰 Dein Basis-Paket:</strong> {price}EUR einmalig. Andrea erklaert dir alles Weitere.</div>
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
    { id: "welcome", bot: ["Hey! Ich bin Alina von der Zwergengruppe.", "In unter 2 Minuten zeige ich dir, wie viel Elterngeld dir zusteht."], type: "start" },
    { id: "arbeitsmodell_first", bot: ["Bist du angestellt oder selbstaendig?"], type: "select", options: [{ label: "Angestellt", value: "angestellt" }, { label: "Selbstaendig", value: "selbstaendig" }] },
    { id: "geburtstermin", bot: ["Wann ist der Geburtstermin?"], type: "date" },
    { id: "einkommen_pt1", bot: ["Dein monatliches Brutto-Einkommen?"], type: "select", options: [{ label: "Unter 1.500 EUR", value: 1200 }, { label: "1.500 – 2.500 EUR", value: 2000 }, { label: "2.500 – 3.500 EUR", value: 3000 }, { label: "3.500 – 4.500 EUR", value: 4000 }, { label: "Ueber 4.500 EUR", value: 5000 }] },
    { id: "einkommen_pt2", bot: ["Hat ein zweiter Elternteil Einkommen?"], type: "select", options: [{ label: "Nein, nur ich", value: 0 }, { label: "Unter 1.500 EUR", value: 1200 }, { label: "1.500 – 2.500 EUR", value: 2000 }, { label: "2.500 – 3.500 EUR", value: 3000 }, { label: "Ueber 4.500 EUR", value: 5000 }] },
    { id: "geschwister", bot: ["Gibt es bereits Geschwister?"], type: "select", options: [{ label: "Ja", value: "ja" }, { label: "Nein", value: "nein" }] },
    { id: "besonderheiten", bot: ["Besonderheiten in deiner Situation?"], type: "text" },
    { id: "phonegate", bot: ["Super! Dein Ergebnis ist fertig.", "Trag deine Kontaktdaten ein, dann ruft dich Andrea an."], type: "phonegate" },
  ];

  const cur = FLOW[step];
  const result = gated ? calcEG(answers) : null;

  useEffect(() => {
    if (!cur) return;
    const nm = [];
    for (let i = 0; i < cur.bot.length; i++) {
      nm.push({ from: "bot", text: cur.bot[i], delay: i * 850 + 350, id: step + "-b-" + i });
    }
    setMsgs((p) => p.concat(nm));
    setTimeout(() => setShowOpts(true), cur.bot.length * 850 + 550);
  }, [step, cur]);

  useEffect(() => {
    if (chatRef.current) setTimeout(() => { chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 100);
  }, [msgs, showOpts, showRes, gated]);

  const answer = (display, value) => {
    setShowOpts(false);
    setMsgs((p) => p.concat([{ from: "user", text: display, id: step + "-u" }]));
    const newAns = { ...answers, [cur.id]: value };
    setAnswers(newAns);
    if (step === 0 && window.fbq) window.fbq("track", "InitiateCheckout");
    setTimeout(() => setStep(step + 1), 450);
  };

  const onDate = (e) => {
    e.preventDefault();
    if (!inputVal) return;
    answer(inputVal, inputVal);
    setInputVal("");
  };

  const onTextInput = (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    answer(inputVal.trim(), inputVal.trim());
    setInputVal("");
  };

  const onPhone = (firstName, email, phone, time) => {
    setSubmitting(true);
    setUName(firstName);
    const r = calcEG(answers);

    if (window.fbq) window.fbq("track", "Lead");

    fetch("/api/submit-to-sheets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        name: firstName,
        email: email,
        phone: phone,
        callTime: time,
        arbeitsmodell: answers.arbeitsmodell_first,
        geburtstermin: answers.geburtstermin || "",
        einkommen_pt1: answers.einkommen_pt1 || "",
        einkommen_pt2: answers.einkommen_pt2 || "",
        geschwister: answers.geschwister || "",
        besonderheiten: answers.besonderheiten || "",
        elterngeld_ohne: r.eg,
        elterngeld_mit: r.opt,
        elterngeld_diff: r.diff,
        price: answers.arbeitsmodell_first === "angestellt" ? 297 : 397
      })
    }).catch(console.log);

    setMsgs((p) => p.concat([{ from: "user", text: firstName + " — " + email, id: "phone-u" }]));
    setTimeout(() => {
      setGated(true);
      setSubmitting(false);
      setShowOpts(false);
      setMsgs((p) => p.concat([{ from: "bot", text: firstName + ", hier ist dein Ergebnis:", delay: 400, id: "res-b" }]));
      setTimeout(() => setShowRes(true), 1200);
    }, 800);
  };

  const progPct = step > 0 && step < FLOW.length ? Math.round(Math.min((step - 1) / 8, 1) * 100) : 0;

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", color: C.text, background: C.cream, minHeight: "100vh" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes egPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}a{color:${C.green}}`}</style>

      <nav style={{ background: "#fff", borderBottom: "1px solid " + C.border, padding: "8px 16px", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={LOGO} alt="Zwergengruppe" style={{ height: 28, width: "auto" }} />
            <div><div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 15, color: C.forest }}>Zwergengruppe</div></div>
          </div>
        </div>
      </nav>

      {!started ? (
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px" }}>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid " + C.border, padding: "28px 24px", textAlign: "center", boxShadow: "0 6px 30px rgba(45,106,79,.06)" }}>
            <img src={ALINA_FOTO} alt="Alina" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", objectPosition: "center 30%", marginBottom: 8 }} />
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: C.forest, marginBottom: 8 }}>Elterngeld-Schnellcheck</h1>
            <p style={{ fontSize: 13, color: C.textMed, lineHeight: 1.5, marginBottom: 16 }}>5 kurze Fragen, unter 2 Minuten, sofort dein Ergebnis</p>
            <button onClick={() => setStarted(true)} style={{ background: "linear-gradient(135deg," + C.green + "," + C.greenMid + ")", color: "#fff", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", animation: "egPulse 2.5s infinite" }}>
              Schnellcheck starten →
            </button>
          </div>
        </section>
      ) : (
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 24px" }}>
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid " + C.border, overflow: "hidden", boxShadow: "0 6px 30px rgba(45,106,79,.06)" }}>
            {step > 0 && step < FLOW.length && !gated && <div style={{ height: 5, background: C.borderLight, position: "relative" }}><div style={{ height: "100%", background: "linear-gradient(90deg," + C.green + "," + C.greenLight + ")", width: progPct + "%", transition: "width .45s" }} /></div>}
            {gated && <div style={{ height: 5, background: C.greenLight }} />}
            <div ref={chatRef} style={{ padding: "20px 18px", overflowY: "auto", maxHeight: "58vh", display: "flex", flexDirection: "column", gap: 8 }}>
              {msgs.map((m) => m.from === "bot" ? <Bot key={m.id} delay={m.delay}>{m.text}</Bot> : <User key={m.id} text={m.text} />)}
              {showOpts && cur?.type === "phonegate" && !gated && <PhoneGate onSubmit={onPhone} loading={submitting} />}
              {showRes && result && <Result result={result} answers={answers} userName={uName} arbeitsmodell={answers.arbeitsmodell_first} />}
            </div>
            {showOpts && cur && cur.type !== "phonegate" && !gated && (
              <div style={{ borderTop: "1px solid " + C.border, padding: "14px 18px", background: C.greenFaint }}>
                {cur.type === "start" && <Btn label="Los geht's! 🚀" onClick={() => answer("Los geht's!", true)} />}
                {cur.type === "date" && <form onSubmit={onDate} style={{ display: "flex", gap: 8 }}><input type="date" value={inputVal} onChange={(e) => setInputVal(e.target.value)} style={{ flex: 1, border: "2px solid " + C.border, borderRadius: 10, padding: "9px 12px", fontSize: 14, fontFamily: "inherit", outline: "none" }} /><button type="submit" style={{ width: 42, height: 42, borderRadius: 10, border: "none", background: C.green, color: "#fff", fontSize: 18, cursor: "pointer" }}>→</button></form>}
                {cur.type === "text" && <form onSubmit={onTextInput} style={{ display: "flex", gap: 8 }}><input type="text" placeholder="Antwort..." value={inputVal} onChange={(e) => setInputVal(e.target.value)} style={{ flex: 1, border: "2px solid " + C.border, borderRadius: 10, padding: "9px 12px", fontSize: 14, fontFamily: "inherit", outline: "none" }} /><button type="submit" style={{ width: 42, height: 42, borderRadius: 10, border: "none", background: C.green, color: "#fff", fontSize: 18, cursor: "pointer" }}>→</button></form>}
                {cur.type === "select" && <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{cur.options.map((o) => <Btn key={o.value} label={o.label} onClick={() => answer(o.label, o.value)} />)}</div>}
              </div>
            )}
          </div>
        </section>
      )}

      <footer style={{ borderTop: "1px solid " + C.border, background: "#fff", padding: 20, textAlign: "center", fontSize: 12.5, color: C.textLight }}>
        <p>© 2026 Zwergengruppe · Elterngeld-Beratung</p>
      </footer>
    </div>
  );
}
