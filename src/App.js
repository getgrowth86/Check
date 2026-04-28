import { useState, useEffect, useRef } from "react";

var CALENDLY = "https://calendly.com/zwergengruppe/zwergengruppe-kennenlerngesprach-1";
var LOGO = "https://i.imgur.com/SWNd8hL.png";
var ALINA_FOTO = "https://i.imgur.com/T3OCg2m.jpeg";

var C = {
  forest: "#1b4332", green: "#2d6a4f", greenMid: "#40916c", greenLight: "#52b788",
  greenPale: "#d8f3dc", greenFaint: "#f0faf4", cream: "#fffdf7",
  accent: "#e76f51", accentSoft: "#fce8e2", accentDark: "#c4553d", warm: "#f4a261",
  text: "#1a1a2e", textMed: "#3d4550", textLight: "#6b7280",
  border: "#e5e7eb", borderLight: "#f3f4f6",
};

function calcEG(a) {
  var b = a.einkommen_pt1 || 2000;
  var sk = a.steuerklasse || "1";
  var abz = 0.60;
  if (sk === "3") abz = 0.73;
  else if (sk === "5") abz = 0.54;
  else if (sk === "2") abz = 0.62;
  else if (sk === "4") abz = 0.59;
  var n = b * abz;
  var pct = 0.67;
  if (n < 1000) pct = Math.min(0.67 + (1000 - n) * 0.001, 1.0);
  else if (n > 1200) pct = Math.max(0.67 - (n - 1200) * 0.001, 0.65);
  var eg = Math.max(300, Math.min(Math.round(n * pct), 1800));
  var opt = eg;
  var tipps = [];
  if (sk === "5" || sk === "4") {
    var bEG = Math.min(Math.round(b * 0.73 * 0.67), 1800);
    var d = bEG - eg;
    if (d > 30) {
      opt = bEG;
      tipps.push({ icon: "💡", title: "Steuerklassenwechsel", text: "Wechsel auf Klasse III bringt ca. " + d + " €/Monat mehr. Über 12 Monate sind das " + (d * 12) + " € zusätzlich.", urgent: true });
    }
  }
  if (sk === "unknown") tipps.push({ icon: "⚠️", title: "Steuerklasse klären", text: "Die Steuerklasse beeinflusst dein Elterngeld massiv. Das muss vor der Geburt geklärt werden.", urgent: true });
  if (a.geschwister === "ja") tipps.push({ icon: "👶", title: "Geschwisterbonus", text: "Mit einem älteren Geschwister bekommst du einen monatlichen Zuschlag. Das können bis zu 10% mehr sein!" });
  if (a.arbeitsmodell_first === "selbstaendig") tipps.push({ icon: "📊", title: "Gewinnermittlung", text: "Bei Selbstständigen zählt der Gewinn der letzten 12 Monate. Die richtige Gestaltung kann dein Elterngeld deutlich erhöhen." });
  if (tipps.length === 0) tipps.push({ icon: "🎯", title: "Individuelle Analyse", text: "Jede Situation ist anders. Im persönlichen Gespräch finden wir die optimale Kombination für euch." });
  return { eg: eg, opt: opt, diff: (opt * 14) - (eg * 12), tipps: tipps };
}

function Stars() { return <span style={{ color: "#f59e0b", fontSize: 13, letterSpacing: 2 }}>{"★★★★★"}</span>; }

function Dots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "6px 0" }}>
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.textLight, animation: "egDot 1.2s 0s infinite" }} />
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.textLight, animation: "egDot 1.2s 0.17s infinite" }} />
      <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.textLight, animation: "egDot 1.2s 0.34s infinite" }} />
    </div>
  );
}

function Bot(props) {
  var delay = props.delay || 0;
  var [show, setShow] = useState(delay === 0);
  useEffect(function () { if (delay > 0) { var t = setTimeout(function () { setShow(true); }, delay); return function () { clearTimeout(t); }; } }, [delay]);
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start", opacity: show ? 1 : 0, transition: "opacity 0.3s" }}>
      <img src={ALINA_FOTO} alt="Alina" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover", objectPosition: "center 30%", flexShrink: 0 }} />
      <div style={{ background: C.borderLight, borderRadius: "4px 14px 14px 14px", padding: "11px 15px", fontSize: 14.5, lineHeight: 1.55, maxWidth: "82%", color: C.text }}>
        {show ? props.children : <Dots />}
      </div>
    </div>
  );
}

function User(props) {
  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <div style={{ background: C.green, color: "#fff", borderRadius: "14px 4px 14px 14px", padding: "10px 15px", fontSize: 14.5, lineHeight: 1.5, maxWidth: "75%" }}>{props.text}</div>
    </div>
  );
}

function Btn(props) {
  var [h, setH] = useState(false);
  return (
    <button onClick={props.onClick} onMouseEnter={function () { setH(true); }} onMouseLeave={function () { setH(false); }}
      style={{ border: "2px solid " + (h ? C.greenMid : C.green), background: h ? C.green : "#fff", color: h ? "#fff" : C.green, borderRadius: 10, padding: "9px 16px", fontSize: 13.5, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", transition: "all .18s", whiteSpace: "nowrap" }}>
      {props.label}
    </button>
  );
}

function PhoneGate(props) {
  var [phone, setPhone] = useState("");
  var [email, setEmail] = useState("");
  var [name, setName] = useState("");
  var [time, setTime] = useState("");
  var [err, setErr] = useState("");
  
  function submit(e) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !time) { 
      setErr("Bitte alle Felder ausfüllen."); 
      return; 
    }
    if (email.indexOf("@") < 0 || email.indexOf(".") < 0) {
      setErr("Bitte gültige E-Mail eingeben.");
      return;
    }
    setErr("");
    props.onSubmit(name.trim(), email.trim(), phone.trim(), time);
  }
  
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1.5px solid " + C.green, padding: 24, margin: "8px 0" }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>{"📞"}</div>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.forest, margin: "0 0 6px" }}>Andrea ruft dich an!</h3>
        <p style={{ fontSize: 13.5, color: C.textMed, lineHeight: 1.5 }}>Trag deine Kontaktdaten ein und Andrea bespricht deine individuelle Situation mit dir.</p>
      </div>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input type="text" placeholder="Dein Vorname" value={name} onChange={function (e) { setName(e.target.value); }} style={{ border: "1.5px solid " + C.border, borderRadius: 10, padding: "11px 14px", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
        <input type="email" placeholder="Deine E-Mail-Adresse" value={email} onChange={function (e) { setEmail(e.target.value); }} style={{ border: "1.5px solid " + C.border, borderRadius: 10, padding: "11px 14px", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
        <input type="tel" placeholder="Deine Telefonnummer" value={phone} onChange={function (e) { setPhone(e.target.value); }} style={{ border: "1.5px solid " + C.border, borderRadius: 10, padding: "11px 14px", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
        <select value={time} onChange={function (e) { setTime(e.target.value); }} style={{ border: "1.5px solid " + C.border, borderRadius: 10, padding: "11px 14px", fontSize: 14, fontFamily: "inherit", outline: "none" }}>
          <option value="">Wann bist du erreichbar?</option>
          <option value="09-12">9-12 Uhr</option>
          <option value="12-15">12-15 Uhr</option>
          <option value="15-18">15-18 Uhr</option>
          <option value="18-20">18-20 Uhr</option>
        </select>
        {err && <p style={{ fontSize: 12, color: C.accent, margin: 0 }}>{err}</p>}
        <button type="submit" disabled={props.loading} style={{ background: "linear-gradient(135deg," + C.green + "," + C.greenMid + ")", color: "#fff", border: "none", borderRadius: 10, padding: "13px 20px", fontSize: 15, fontWeight: 700, cursor: props.loading ? "wait" : "pointer", fontFamily: "inherit", opacity: props.loading ? 0.7 : 1 }}>
          {props.loading ? "Wird verarbeitet..." : "Andrea soll mich anrufen →"}
        </button>
      </form>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 12, fontSize: 11, color: C.textLight }}>
        <span>{"🔒"} DSGVO-konform</span><span>Keine Spam-Anrufe</span><span>Unverbindlich</span>
      </div>
    </div>
  );
}

function Result(props) {
  var r = props.result;
  var price = props.arbeitsmodell_first === "angestellt" ? 297 : 397;
  return (
    <div style={{ background: C.cream, borderRadius: 14, border: "1px solid " + C.border, padding: 20, margin: "8px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 24 }}>{"📊"}</span>
        <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.forest, margin: 0 }}>{props.userName ? props.userName + ", dein" : "Dein"} Elterngeld-Ergebnis</h3>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <div style={{ border: "1px solid " + C.border, borderRadius: 10, padding: 14, background: "#fff" }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: C.textLight }}>Ohne Optimierung</div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display',serif", marginTop: 4 }}>{r.eg} €<span style={{ fontSize: 13, fontWeight: 400, color: C.textLight }}>/Monat</span></div>
          <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>{(r.eg * 12).toLocaleString("de-DE")} € gesamt</div>
        </div>
        <div style={{ border: "1.5px solid " + C.green, borderRadius: 10, padding: 14, background: C.greenFaint }}>
          <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", color: C.green }}>Mit Beratung</div>
          <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Playfair Display',serif", color: C.green, marginTop: 4 }}>{r.opt} €<span style={{ fontSize: 13, fontWeight: 400, color: C.greenMid }}>/Monat</span></div>
          <div style={{ fontSize: 11, color: C.greenMid, marginTop: 2 }}>{(r.opt * 14).toLocaleString("de-DE")} € gesamt</div>
        </div>
      </div>
      {r.diff > 0 && (
        <div style={{ background: "linear-gradient(135deg," + C.forest + "," + C.green + ")", color: "#fff", borderRadius: 10, padding: 14, display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 20 }}>{"🚀"}</span>
          <div>
            <strong style={{ fontSize: 16 }}>Bis zu {r.diff.toLocaleString("de-DE")} € mehr möglich</strong>
            <p style={{ margin: "3px 0 0", fontSize: 13, opacity: 0.85 }}>Geld, das dir zusteht. Du musst es nur richtig beantragen.</p>
          </div>
        </div>
      )}
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.forest, marginBottom: 10 }}>Deine Optimierungshebel:</div>
        {r.tipps.map(function (t, i) {
          return (
            <div key={i} style={{ borderLeft: "3px solid " + (t.urgent ? C.accent : C.green), paddingLeft: 12, marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600 }}><span>{t.icon}</span>{t.title}</div>
              <p style={{ fontSize: 12.5, lineHeight: 1.5, color: C.textMed, margin: "3px 0 0" }}>{t.text}</p>
            </div>
          );
        })}
      </div>
      <div style={{ background: C.accentSoft, borderLeft: "3px solid " + C.accent, borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 13, lineHeight: 1.6, color: C.text }}>
        <strong>{"💰"} Dein Basis-Paket:</strong> {price}€ einmalig. Andrea erklärt dir alles Weitere.
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 12.5, color: C.textMed, margin: "0 0 10px" }}>Andrea ruft dich bald an und bespricht deine individuelle Situation.</p>
      </div>
    </div>
  );
}

function FAQ(props) {
  var [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid " + C.border, padding: "14px 0", cursor: "pointer" }} onClick={function () { setOpen(!open); }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: C.forest }}>{props.q}</span>
        <span style={{ fontSize: 18, color: C.textLight, transition: "transform .2s", transform: open ? "rotate(45deg)" : "rotate(0)", flexShrink: 0 }}>+</span>
      </div>
      {open && <p style={{ fontSize: 13.5, color: C.textMed, lineHeight: 1.6, marginTop: 10, paddingRight: 20 }}>{props.a}</p>}
    </div>
  );
}

export default function App() {
  var [step, setStep] = useState(0);
  var [answers, setAnswers] = useState({});
  var [msgs, setMsgs] = useState([]);
  var [showOpts, setShowOpts] = useState(false);
  var [inputVal, setInputVal] = useState("");
  var [started, setStarted] = useState(false);
  var [gated, setGated] = useState(false);
  var [submitting, setSubmitting] = useState(false);
  var [uName, setUName] = useState("");
  var [showRes, setShowRes] = useState(false);
  var chatRef = useRef(null);

  var FLOW = [
    { id: "welcome", bot: ["Hey! Ich bin Alina von der Zwergengruppe.", "In unter 2 Minuten zeige ich dir, wie viel Elterngeld dir zusteht und wo du möglicherweise Geld verschenkst."], type: "start" },
    
    // NEU: Angestellt/Selbständig ZUERST (bestimmt Preis)
    { id: "arbeitsmodell_first", bot: ["Bist du angestellt oder selbständig?"], type: "select", options: [{ label: "Angestellt", value: "angestellt" }, { label: "Selbständig (auch nebenberuflich)", value: "selbstaendig" }] },
    
    { id: "geburtstermin", bot: ["Wann ist der errechnete Geburtstermin?"], type: "date" },
    
    // NEU: Einkommen Elternteil 1
    { id: "einkommen_pt1", bot: ["Wie hoch ist dein monatliches Brutto-Einkommen?"], type: "select", options: [{ label: "Unter 1.500 €", value: 1200 }, { label: "1.500 – 2.500 €", value: 2000 }, { label: "2.500 – 3.500 €", value: 3000 }, { label: "3.500 – 4.500 €", value: 4000 }, { label: "Über 4.500 €", value: 5000 }] },
    
    // NEU: Einkommen Elternteil 2
    { id: "einkommen_pt2", bot: ["Hat ein zweiter Elternteil Einkommen? Wenn ja, wie viel?"], type: "select", options: [{ label: "Nein, nur ich", value: 0 }, { label: "Unter 1.500 €", value: 1200 }, { label: "1.500 – 2.500 €", value: 2000 }, { label: "2.500 – 3.500 €", value: 3000 }, { label: "3.500 – 4.500 €", value: 4000 }, { label: "Über 4.500 €", value: 5000 }] },
    
    // NEU: Geschwister
    { id: "geschwister", bot: ["Gibt es bereits ein oder mehrere Geschwister?"], type: "select", options: [{ label: "Ja", value: "ja" }, { label: "Nein", value: "nein" }] },
    
    // Conditional: Wenn Geschwister = Ja, frag nach Geburtsdatum
    { id: "geschwister_geburt", bot: ["Wann wurde das älteste Geschwisterkind geboren? (Ungefähr)"], type: "date", conditional: "geschwister", conditionalValue: "ja" },
    
    // NEU: Besonderheiten Textfeld
    { id: "besonderheiten", bot: ["Gibt es Besonderheiten in deiner Situation? (z.B. Mehrlingsschwangerschaft, Frühgeburten, besondere Einkommenssituationen)"], type: "text" },
    
    // NEU: PhoneGate statt EmailGate
    { id: "phonegate", bot: ["Super! Dein Ergebnis ist fertig berechnet.", "Trag kurz deine Telefonnummer ein, dann ruft dich Andrea an und bespricht alles mit dir."], type: "phonegate" },
  ];

  var cur = FLOW[step];
  
  // Skip conditional questions
  useEffect(function () {
    if (!cur) return;
    if (cur.conditional && answers[cur.conditional] !== cur.conditionalValue) {
      setStep(step + 1);
    }
  }, [step, cur, answers]);

  var result = gated ? calcEG(answers) : null;

  useEffect(function () {
    if (!cur) return;
    var nm = [];
    for (var i = 0; i < cur.bot.length; i++) {
      nm.push({ from: "bot", text: cur.bot[i], delay: i * 850 + 350, id: step + "-b-" + i });
    }
    setMsgs(function (p) { return p.concat(nm); });
    setTimeout(function () { setShowOpts(true); }, cur.bot.length * 850 + 550);
  }, [step, cur]);

  useEffect(function () {
    if (chatRef.current) setTimeout(function () { chatRef.current.scrollTop = chatRef.current.scrollHeight; }, 100);
  }, [msgs, showOpts, showRes, gated]);

  function answer(display, value) {
    setShowOpts(false);
    setMsgs(function (p) { return p.concat([{ from: "user", text: display, id: step + "-u" }]); });
    var newAns = Object.assign({}, answers);
    newAns[cur.id] = value;
    setAnswers(newAns);
    if (step === 0 && window.fbq) { window.fbq('track', 'InitiateCheckout'); }
    setTimeout(function () { setStep(step + 1); }, 450);
  }

  function onDate(e) {
    e.preventDefault();
    if (!inputVal) return;
    answer(inputVal, inputVal);
    setInputVal("");
  }

  function onTextInput(e) {
    e.preventDefault();
    if (!inputVal.trim()) return;
    answer(inputVal.trim(), inputVal.trim());
    setInputVal("");
  }

  function onPhone(firstName, email, phone, time) {
    setSubmitting(true);
    setUName(firstName);
    var r = calcEG(answers);

    if (window.fbq) { window.fbq('track', 'Lead'); }

    // Sende zu Vercel Function → Google Sheets
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
        geschwister_geburt: answers.geschwister_geburt || "",
        besonderheiten: answers.besonderheiten || "",
        elterngeld_ohne: r.eg,
        elterngeld_mit: r.opt,
        elterngeld_diff: r.diff,
        price: answers.arbeitsmodell_first === "angestellt" ? 297 : 397
      })
    }).then(function (res) {
      console.log("Google Sheets:", res.status);
    }).catch(function (err) {
      console.log("Submit error:", err);
    });

    setMsgs(function (p) { return p.concat([{ from: "user", text: firstName + " — " + email + " — " + phone, id: "phone-u" }]); });
    setTimeout(function () {
      setGated(true);
      setSubmitting(false);
      setShowOpts(false);
      setMsgs(function (p) {
        return p.concat([{ from: "bot", text: firstName + ", hier ist dein Ergebnis:", delay: 400, id: "res-b" }]);
      });
      setTimeout(function () { setShowRes(true); }, 1200);
    }, 800);
  }

  var progPct = step > 0 && step < FLOW.length ? Math.round(Math.min((step - 1) / 8, 1) * 100) : 0;
  var progLabel = Math.min(step - 1, 8);

  return (
    <div style={{ fontFamily: "'DM Sans',system-ui,sans-serif", color: C.text, background: C.cream, minHeight: "100vh" }}>
      <style>{[
        "@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');",
        "*{box-sizing:border-box;margin:0;padding:0}",
        "@keyframes egDot{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-6px);opacity:1}}",
        "@keyframes egPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}",
        "a{color:" + C.green + "}",
        "@media(max-width:600px){.hero-section{padding-top:16px!important;padding-bottom:12px!important}.hero-h1{font-size:24px!important}.hero-sub{font-size:14px!important;margin-top:6px!important}.hero-stats{margin-top:10px!important;gap:16px!important}.hero-badge{margin-bottom:8px!important}.start-card{padding:20px 20px!important}.start-photo{width:50px!important;height:50px!important;margin-bottom:8px!important}.start-title{font-size:17px!important}.start-desc{margin-bottom:12px!important}}",
      ].join("\n")}</style>

      <nav style={{ background: "#fff", borderBottom: "1px solid " + C.border, padding: "8px 16px", position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={LOGO} alt="Zwergengruppe" style={{ height: 28, width: "auto" }} />
            <div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, fontSize: 15, color: C.forest }}>Zwergengruppe</div>
              <div style={{ fontSize: 10, color: C.textLight }}>Zertifizierte Elterngeld-Beratung</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}><Stars /><span style={{ fontSize: 10.5, color: C.textLight, fontWeight: 600 }}> 4,9/5</span></div>
            <div style={{ fontSize: 10, fontWeight: 600, color: C.green, background: C.greenPale, padding: "3px 8px", borderRadius: 16 }}>DSGVO</div>
          </div>
        </div>
      </nav>

      <section className="hero-section" style={{ maxWidth: 720, margin: "0 auto", padding: "20px 20px 12px", textAlign: "center" }}>
        <div className="hero-badge" style={{ display: "inline-block", background: C.accentSoft, color: C.accent, fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 20, marginBottom: 10 }}>{"⏰"} Steuerklassenwechsel? Nur vor der Geburt möglich!</div>
        <h1 className="hero-h1" style={{ fontFamily: "'Playfair Display',serif", fontSize: "clamp(22px,5vw,36px)", fontWeight: 700, lineHeight: 1.2, color: C.forest }}>
          Verschenkst du <span style={{ color: C.accent, fontStyle: "italic" }}>tausende Euro</span> Elterngeld?
        </h1>
        <p className="hero-sub" style={{ fontSize: 14, color: C.textMed, marginTop: 8, lineHeight: 1.5, maxWidth: 560, margin: "8px auto 0" }}>
          Beantworte 5 kurze Fragen und erfahre sofort, wie viel Elterngeld dir zusteht und wie du mehr herausholen kannst.
        </p>
        <div className="hero-stats" style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 12, flexWrap: "wrap" }}>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 17, fontWeight: 700, color: C.green, fontFamily: "'Playfair Display',serif" }}>100+</div><div style={{ fontSize: 10.5, color: C.textLight }}>Familien beraten</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 17, fontWeight: 700, color: C.green, fontFamily: "'Playfair Display',serif" }}>{"\u00D8"} 4.200 €</div><div style={{ fontSize: 10.5, color: C.textLight }}>mehr Elterngeld</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 17, fontWeight: 700, color: C.green, fontFamily: "'Playfair Display',serif" }}>0</div><div style={{ fontSize: 10.5, color: C.textLight }}>Antrags-Ablehnungen</div></div>
        </div>
      </section>

      {!started ? (
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 16px" }}>
          <div className="start-card" style={{ background: "#fff", borderRadius: 16, border: "1px solid " + C.border, padding: "20px 24px", textAlign: "center", boxShadow: "0 6px 30px rgba(45,106,79,.06)" }}>
            <img className="start-photo" src={ALINA_FOTO} alt="Alina" style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", objectPosition: "center 30%", marginBottom: 8 }} />
            <h2 className="start-title" style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.forest, marginBottom: 6 }}>Kostenloser Elterngeld-Schnellcheck</h2>
            <p className="start-desc" style={{ fontSize: 13, color: C.textMed, lineHeight: 1.5, maxWidth: 440, margin: "0 auto 14px" }}>5 einfache Fragen {"·"} Unter 2 Minuten {"·"} Sofort dein Ergebnis</p>
            <button onClick={function () { setStarted(true); }} style={{ background: "linear-gradient(135deg," + C.green + "," + C.greenMid + ")", color: "#fff", border: "none", borderRadius: 12, padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(45,106,79,.2)", animation: "egPulse 2.5s infinite ease-in-out" }}>
              Jetzt Schnellcheck starten {"→"}
            </button>
            <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 10, fontSize: 11, color: C.textLight }}>
              <span>Keine Registrierung</span><span>{"·"}</span><span>Kein Spam</span>
            </div>
          </div>
        </section>
      ) : (
        <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 24px" }}>
          <div style={{ background: "#fff", borderRadius: 18, border: "1px solid " + C.border, overflow: "hidden", boxShadow: "0 6px 30px rgba(45,106,79,.06)" }}>
            {step > 0 && step < FLOW.length && !gated && (
              <div style={{ height: 5, background: C.borderLight, position: "relative" }}>
                <div style={{ height: "100%", background: "linear-gradient(90deg," + C.green + "," + C.greenLight + ")", borderRadius: 3, width: progPct + "%", transition: "width .45s ease" }} />
                <span style={{ position: "absolute", right: 10, top: 8, fontSize: 10.5, color: C.textLight }}>Frage {progLabel > 0 ? progLabel : 1} von 8</span>
              </div>
            )}
            {gated && <div style={{ height: 5, background: C.greenLight }} />}
            <div ref={chatRef} style={{ padding: "20px 18px", overflowY: "auto", maxHeight: "58vh", display: "flex", flexDirection: "column", gap: 8 }}>
              {msgs.map(function (m) {
                if (m.from === "bot") return <Bot key={m.id} delay={m.delay}>{m.text}</Bot>;
                return <User key={m.id} text={m.text} />;
              })}
              {showOpts && cur && cur.type === "phonegate" && !gated && <PhoneGate onSubmit={onPhone} loading={submitting} />}
              {showRes && result && <Result result={result} answers={answers} userName={uName} arbeitsmodell_first={answers.arbeitsmodell_first} />}
            </div>
            {showOpts && cur && cur.type !== "phonegate" && !gated && (
              <div style={{ borderTop: "1px solid " + C.border, padding: "14px 18px", background: C.greenFaint }}>
                {cur.type === "start" && <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}><Btn label={"Los geht's! 🚀"} onClick={function () { answer("Los geht's!", true); }} /></div>}
                {cur.type === "date" && (
                  <form onSubmit={onDate} style={{ display: "flex", gap: 8 }}>
                    <input type="date" value={inputVal} onChange={function (e) { setInputVal(e.target.value); }} style={{ flex: 1, border: "2px solid " + C.border, borderRadius: 10, padding: "9px 12px", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
                    <button type="submit" disabled={!inputVal} style={{ width: 42, height: 42, borderRadius: 10, border: "none", background: C.green, color: "#fff", fontSize: 18, fontWeight: 700, cursor: "pointer" }}>{"→"}</button>
                  </form>
                )}
                {cur.type === "text" && (
                  <form onSubmit={onTextInput} style={{ display: "flex", gap: 8 }}>
                    <input type="text" placeholder="Deine Antwort..." value={inputVal} onChange={function (e) { setInputVal(e.target.value); }} style={{ flex: 1, border: "2px solid " + C.border, borderRadius: 10, padding: "9px 12px", fontSize: 14, fontFamily: "inherit", outline: "none" }} />
                    <button type="submit" disabled={!inputVal.trim()} style={{ width: 42, height: 42, borderRadius: 10, border: "none", background: C.green, color: "#fff", fontSize: 18, fontWeight: 700, cursor: "pointer" }}>{"→"}</button>
                  </form>
                )}
                {cur.type === "select" && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {cur.options.map(function (o) { return <Btn key={o.value} label={o.label} onClick={function () { answer(o.label, o.value); }} />; })}
                  </div>
                )}
              </div>
            )}
          </div>
          <div style={{ textAlign: "center", marginTop: 10, fontSize: 11.5, color: C.textLight }}>{"🔒"} DSGVO-konform {"·"} Kein Spam {"·"} Jederzeit abmeldbar</div>
        </section>
      )}

      {/* REST der Seite: Testimonials, FAQ, etc. bleiben unverändert */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "36px 20px" }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: C.forest, textAlign: "center", marginBottom: 6 }}>Das haben andere Familien erreicht</h2>
        <p style={{ textAlign: "center", fontSize: 14, color: C.textLight, marginBottom: 24 }}>Echte Ergebnisse aus unseren Beratungen</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
          {[
            { name: "Melanie & Tom", sit: "Steuerklasse V → III", v: "640 €/Mon.", n: "1.180 €/Mon.", d: "+6.480 €", q: "Ohne Alina hätten wir über 6.000 € verschenkt!" },
            { name: "Sarah", sit: "Selbstständig, alleinerziehend", v: "890 €/Mon.", n: "1.420 €/Mon.", d: "+9.460 €", q: "Die Beratung hat sich 30-fach bezahlt gemacht." },
            { name: "Lisa & Jan", sit: "Partnerschaftsbonus genutzt", v: "1.100 €/Mon.", n: "1.100 € + 4 Bonusmonate", d: "+4.400 €", q: "Alina hat alles durchgerechnet und geplant." },
            { name: "Julia & Marco", sit: "Nebenberuflich selbstständig", v: "720 €/Mon.", n: "1.240 €/Mon.", d: "+7.840 €", q: "Als nebenberuflich Selbstständige dachte ich, Elterngeld wird kompliziert. Alina hat alles so erklärt, dass wir uns keine Sorgen mehr machen mussten." },
          ].map(function (c, i) {
            return (
              <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid " + C.border, padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><div style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</div><div style={{ fontSize: 12, color: C.textLight }}>{c.sit}</div></div>
                  <Stars />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1, background: C.borderLight, borderRadius: 8, padding: "8px 10px", textAlign: "center" }}><div style={{ fontSize: 10, color: C.textLight, fontWeight: 600 }}>VORHER</div><div style={{ fontSize: 14, fontWeight: 700 }}>{c.v}</div></div>
                  <div style={{ flex: 1, background: C.greenFaint, borderRadius: 8, padding: "8px 10px", textAlign: "center", border: "1px solid " + C.greenPale }}><div style={{ fontSize: 10, color: C.green, fontWeight: 600 }}>NACHHER</div><div style={{ fontSize: 14, fontWeight: 700, color: C.green }}>{c.n}</div></div>
                </div>
                <div style={{ background: C.greenFaint, borderRadius: 8, padding: "6px 10px", textAlign: "center", fontSize: 13, fontWeight: 700, color: C.green }}>{c.d} über den Bezugszeitraum</div>
                <p style={{ fontSize: 13, color: C.textMed, lineHeight: 1.55, fontStyle: "italic" }}>&bdquo;{c.q}&ldquo;</p>
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ maxWidth: 720, margin: "0 auto", padding: "20px 20px 36px" }}>
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid " + C.border, padding: 28, display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
          <img src={ALINA_FOTO} alt="Alina Nußbaum" style={{ width: 90, height: 90, borderRadius: "50%", objectFit: "cover", objectPosition: "center 30%", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 240 }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, fontWeight: 700, color: C.forest, marginBottom: 4 }}>Alina Nußbaum</h3>
            <p style={{ fontSize: 13, color: C.green, fontWeight: 600, marginBottom: 10 }}>Elterngeld-Expertin {"·"} Zertifizierte Wirtschaftswissenschaftlerin {"·"} Gründerin Zwergengruppe</p>
            <p style={{ fontSize: 13.5, color: C.textMed, lineHeight: 1.6, marginBottom: 12 }}>
              Ich bringe tiefes Steuer- und Finanzwissen mit. Ich optimiere nicht nur euren Antrag, sondern verstehe, wie Steuerklasse, Progressionsvorbehalt und eure gesamte Situation zusammenspielen. Das kann den Unterschied von tausenden Euro machen.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12.5, color: C.textMed }}>
              <span>{"✓"} 100+ Familien</span><span>{"✓"} Steuer-Expertise</span><span>{"✓"} Geld-zurück-Garantie</span>
            </div>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 36px" }}>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: C.forest, textAlign: "center", marginBottom: 20 }}>Häufige Fragen</h2>
        <FAQ q="Ist der Schnellcheck wirklich kostenlos?" a="Ja, 100%. Du bekommst eine erste Einschätzung und 3 Sofort-Tipps. Die ausführliche Beratung ist optional." />
        <FAQ q="Was passiert mit meiner E-Mail?" a="Du bekommst 3 bis 5 hilfreiche Mails zum Thema Elterngeld. Kein Spam, jederzeit abmeldbar. DSGVO-konform." />
        <FAQ q="Wann sollte ich mich beraten lassen?" a="Am besten schon vor der Schwangerschaft oder so früh wie möglich. Je früher, desto mehr Stellschrauben können wir nutzen. Zum Beispiel muss der Steuerklassenwechsel spätestens 7 Monate vor der Geburt erfolgen." />
        <FAQ q="Was unterscheidet euch von anderen?" a="Alina ist zertifizierte Wirtschaftswissenschaftlerin mit tiefem Steuerwissen. Sie optimiert nicht nur den Antrag, sondern versteht eure gesamte finanzielle Situation." />
        <FAQ q="Was kostet die Beratung?" a="Das Basis-Paket kostet 297€ (Angestellt) oder 397€ (Selbständig). Dazu kommt optional das Rundumsorglos-Paket mit vollständiger Begleitung." />
      </section>

      <section style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px 40px" }}>
        <div style={{ background: "linear-gradient(135deg," + C.forest + "," + C.green + ")", borderRadius: 16, padding: "32px 28px", textAlign: "center", color: "#fff" }}>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Bereit, dein Elterngeld zu maximieren?</h2>
          <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.6, maxWidth: 480, margin: "0 auto 20px" }}>Die wichtigsten Entscheidungen fallen vor der Geburt. Danach ist es oft zu spät. Sichere dir jetzt dein kostenloses Beratungsgespräch mit Alina.</p>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={{ display: "inline-block", background: "#fff", color: C.green, fontSize: 15, fontWeight: 700, padding: "14px 30px", borderRadius: 12, textDecoration: "none", fontFamily: "inherit", boxShadow: "0 4px 16px rgba(0,0,0,.15)" }}>
            Kostenloses Beratungsgespräch buchen {"→"}
          </a>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 16, fontSize: 12, opacity: 0.75, flexWrap: "wrap" }}>
            <span>15 Min. per Zoom</span><span>100% kostenlos</span><span>Unverbindlich</span>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid " + C.border, background: "#fff", padding: 20, textAlign: "center", fontSize: 12.5, color: C.textLight }}>
        <p>{"©"} 2026 Zwergengruppe {"·"} Elterngeld-Beratung mit Alina Nußbaum</p>
        <p style={{ marginTop: 4 }}><a href="https://www.zwergengruppe.com/datenschutz" style={{ color: C.green, textDecoration: "none" }}>Datenschutz</a> {"·"} <a href="https://www.zwergengruppe.com/impressum" style={{ color: C.green, textDecoration: "none" }}>Impressum</a></p>
        <p style={{ marginTop: 8, fontSize: 11, opacity: 0.6 }}>Hinweis: Unverbindliche Schätzung. Die tatsächliche Höhe wird von der zuständigen Elterngeldstelle ermittelt.</p>
      </footer>
    </div>
  );
}
