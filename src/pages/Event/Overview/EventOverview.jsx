import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getbyeventid } from "@/services/apiServices";
import {
  Heart,
  Instagram,
  Phone,
  MapPin,
  User,
  Calendar,
  Clock,
  Users,
  FileText,
  Image as ImageIcon,
  ChevronRight,
  Sparkles,
  Music4,
  PartyPopper,
  Coffee,
  Gem,
  Droplet,
  Star,
  UtensilsCrossed,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────
// Design tokens
//   Canvas   #FBF6EF  ivory
//   Maroon   #6E1E3A  deep garnet (bride/groom + accents)
//   Maroon2  #4A1226  deeper shade for gradients/text
//   Gold     #C79A4B  antique gold (line, borders, eyebrows)
//   GoldSoft #E9D5A6  pale gold (fills, chips)
//   Blush    #F4E0D6  soft warm fill
//   Ink      #3A2A26  body text
// Display face: Cormorant Garamond (wedding-invite serif)
// Body face:    Manrope
// ─────────────────────────────────────────────────────────────────────────

const COLORS = {
  canvas: "#FBF6EF",
  maroon: "#6E1E3A",
  maroon2: "#4A1226",
  gold: "#C79A4B",
  goldSoft: "#E9D5A6",
  blush: "#F4E0D6",
  ink: "#3A2A26",
  inkSoft: "#8B7A72",
};

// ─── Icon lookup — matched by keyword against the function's name ─────────
const ICON_RULES = [
  { test: /mehndi|henna/i, icon: Sparkles },
  { test: /haldi/i, icon: Droplet },
  { test: /sangeet|music|dance/i, icon: Music4 },
  { test: /engagement|ring/i, icon: Gem },
  { test: /wedding|pheras|vivah/i, icon: Heart },
  { test: /reception/i, icon: PartyPopper },
  { test: /brunch|lunch|dinner|breakfast/i, icon: UtensilsCrossed },
  { test: /coffee|tea/i, icon: Coffee },
];
const pickIcon = (name = "") => (ICON_RULES.find((r) => r.test.test(name)) || { icon: Star }).icon;

// ─── Date/time formatting helpers ──────────────────────────────────────────
// The API sends dates as "DD/MM/YYYY" (e.g. "05/08/2026") and times as
// already-formatted strings (e.g. "10:30 AM") — so times pass through as-is,
// and dates need a dedicated parser since `new Date("05/08/2026")` would be
// misread as MM/DD/YYYY by the browser.
const parseDMY = (str) => {
  if (!str || typeof str !== "string") return null;
  const match = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const [, d, m, y] = match;
  const dt = new Date(Number(y), Number(m) - 1, Number(d));
  return isNaN(dt) ? null : dt;
};

const fmtDate = (d) => {
  if (!d) return "";
  const dt = parseDMY(d) || new Date(d);
  if (isNaN(dt)) return String(d);
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
const fmtDay = (d) => {
  if (!d) return "";
  const dt = parseDMY(d) || new Date(d);
  if (isNaN(dt)) return "";
  return dt.toLocaleDateString("en-IN", { weekday: "long" });
};
const fmtDateRange = (start, end) => {
  const s = fmtDate(start);
  const e = fmtDate(end);
  if (s && e && s !== e) return `${s} – ${e}`;
  return s || e || "";
};

// ─── Maps the raw /event/get API response into the shapes this page uses. ──
const mapEventResponse = (response) => {
  const data = response?.data?.data || response?.data || response || {};
  const other = data.otherInfo || {};

  const groom = other.groomName?.trim() || "Groom";
  const bride = other.brideName?.trim() || "Bride";

  const event = {
    names: [groom, bride],
    handles: [
  other.groomInstaId
    ? { display: `@${other.groomInstaId.replace(/^@/, "")}`, url: `https://instagram.com/${other.groomInstaId.replace(/^@/, "")}` }
    : null,
  other.brideInstaId
    ? { display: `@${other.brideInstaId.replace(/^@/, "")}`, url: `https://instagram.com/${other.brideInstaId.replace(/^@/, "")}` }
    : null,
].filter(Boolean),
    project: data.projectName || "—",
    type: data.eventNameEnglish || "—",
    dateRange: fmtDateRange(data.eventStartDate, data.eventEndDate),
    venue: data.venueNameEnglish || "—",
    eventNo: data.eventNo || "",
    status: data.eventStatus || "",
  };

  // No dedicated "client" contact block in this payload — party fields are
  // often null pre-confirmation, so fall back to groom/bride contact info.
  const client = {
    name: data.partyNameEnglish || groom || bride || "—",
    phone: data.partyMobile || other.groomContactNumber || other.brideContactNumber || "—",
    address: data.venueNameEnglish || "—",
  };

  const rawFunctions = data.eventFunctions || [];
  const functions = rawFunctions.map((fn, idx) => {
    const venue = (fn.venues || [])[0] || {};
    return {
      id: fn.id ?? idx + 1,
      title: fn.nameEnglish || fn.title || `Function ${idx + 1}`,
      icon: pickIcon(fn.nameEnglish || fn.title),
      day: fmtDay(fn.functionDate),
      date: fmtDate(fn.functionDate),
      time: fn.functionTime || "",
      venue: venue.venueNameEnglish || "—",
      venueSub: (venue.subVenues || [])[0]?.nameEnglish || "",
      guests: fn.pax ?? fn.guests ?? "—",
      note: fn.notesEnglish || fn.notesHindi || "",
    };
  });

  return { event, client, functions };
};

// ─── small ornamental flourish used as section dividers ────────────────────
const Flourish = () => (
  <div className="flex items-center justify-center gap-3 py-2">
    <span
      className="h-px w-16 sm:w-24"
      style={{ background: `linear-gradient(90deg, transparent, ${COLORS.gold})` }}
    />
    <Gem size={14} style={{ color: COLORS.gold }} />
    <span
      className="h-px w-16 sm:w-24"
      style={{ background: `linear-gradient(90deg, ${COLORS.gold}, transparent)` }}
    />
  </div>
);

// ─── stat chip in the hero ──────────────────────────────────────────────
const StatChip = ({ icon: Icon, label, value }) => (
  <div
    className="flex-1 min-w-[132px] rounded-2xl px-4 py-3 border"
    style={{ background: "rgba(255,255,255,0.55)", borderColor: "rgba(199,154,75,0.35)" }}
  >
    <p
      className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] m-0"
      style={{ color: COLORS.maroon }}
    >
      <Icon size={11} /> {label}
    </p>
    <p className="text-[13.5px] font-bold m-0 mt-1" style={{ color: COLORS.ink }}>
      {value}
    </p>
  </div>
);

// ─── Hero ────────────────────────────────────────────────────────────────
const Hero = ({ event }) => {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 60);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="relative overflow-hidden rounded-[28px] border"
      style={{
        borderColor: "rgba(199,154,75,0.4)",
        background: `radial-gradient(120% 140% at 0% 0%, ${COLORS.blush} 0%, ${COLORS.canvas} 55%)`,
      }}
    >
      {/* faint corner ornament */}
      <svg
        className="absolute -top-10 -right-10 w-56 h-56 opacity-[0.14] pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="98" stroke={COLORS.gold} strokeWidth="1.2" />
        <circle cx="100" cy="100" r="80" stroke={COLORS.gold} strokeWidth="1.2" />
        <circle cx="100" cy="100" r="62" stroke={COLORS.gold} strokeWidth="1.2" />
      </svg>

      <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12 p-6 sm:p-10 md:p-12">
        {/* Monogram medallion */}
        <div
          className="shrink-0 transition-all duration-700 ease-out"
          style={{
            opacity: entered ? 1 : 0,
            transform: entered ? "scale(1)" : "scale(0.85)",
          }}
        >
          <div
            className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(145deg, ${COLORS.maroon}, ${COLORS.maroon2})`,
              boxShadow: `0 12px 30px -8px rgba(74,18,38,0.45)`,
            }}
          >
            <div
              className="absolute inset-[6px] rounded-full"
              style={{ border: `1.5px solid ${COLORS.goldSoft}` }}
            />
            <div className="flex items-center gap-2 sm:gap-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              <span className="text-4xl sm:text-5xl font-semibold" style={{ color: COLORS.goldSoft }}>
                {(event.names[0] || "?")[0]}
              </span>
              <Heart size={16} style={{ color: COLORS.gold }} fill={COLORS.gold} />
              <span className="text-4xl sm:text-5xl font-semibold" style={{ color: COLORS.goldSoft }}>
                {(event.names[1] || "?")[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Names + meta */}
        <div className="flex-1 min-w-0 text-center md:text-left">
          <p
            className="text-[11px] font-bold uppercase tracking-[0.28em] m-0 transition-all duration-700 ease-out"
            style={{
              color: COLORS.gold,
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(6px)",
            }}
          >
            ✦ The Wedding Celebration Of ✦
          </p>

          <h1
            className="m-0 mt-2 leading-[1.05] font-semibold transition-all duration-700 ease-out"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.4rem, 5vw, 3.4rem)",
              color: COLORS.maroon2,
              opacity: entered ? 1 : 0,
              transform: entered ? "translateY(0)" : "translateY(10px)",
              transitionDelay: "80ms",
            }}
          >
            {event.names[0]} <span style={{ color: COLORS.gold }}>&</span> {event.names[1]}
          </h1>

          {event.handles.length > 0 && (
  <div
    className="flex items-center justify-center md:justify-start gap-2 mt-3 flex-wrap transition-all duration-700 ease-out"
    style={{ opacity: entered ? 1 : 0, transitionDelay: "150ms" }}
  >
    {event.handles.map((h) => (
      <a
        key={h.url}
        href={h.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full transition-colors hover:opacity-80"
        style={{ background: "rgba(110,30,58,0.07)", color: COLORS.maroon }}
      >
        <Instagram size={12} /> {h.display}
      </a>
    ))}
  </div>
)}

          <div
            className="flex flex-wrap gap-2.5 mt-6 transition-all duration-700 ease-out"
            style={{ opacity: entered ? 1 : 0, transitionDelay: "220ms" }}
          >
            <StatChip icon={FileText} label="Project Name" value={event.project} />
            <StatChip icon={Heart} label="Event Type" value={event.type} />
            <StatChip icon={Calendar} label="Event Dates" value={event.dateRange} />
            <StatChip icon={MapPin} label="Venue" value={event.venue} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Client details card ─────────────────────────────────────────────────
const ClientDetails = ({ client }) => (
  <div
    className="rounded-2xl border bg-white overflow-hidden flex flex-col sm:flex-row"
    style={{ borderColor: "rgba(58,42,38,0.08)" }}
  >
    <div className="w-full sm:w-1.5 h-1.5 sm:h-auto shrink-0" style={{ background: COLORS.maroon }} />
    <div className="flex-1 p-5 sm:p-6">
      <p
        className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.16em] m-0"
        style={{ color: COLORS.maroon }}
      >
        <User size={12} /> Client Details
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-3.5">
        <div className="flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: COLORS.blush }}
          >
            <User size={15} style={{ color: COLORS.maroon }} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider m-0" style={{ color: COLORS.inkSoft }}>
              Client Name
            </p>
            <p className="text-[13.5px] font-bold m-0 mt-0.5 truncate" style={{ color: COLORS.ink }}>
              {client.name}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: COLORS.blush }}
          >
            <Phone size={15} style={{ color: COLORS.maroon }} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider m-0" style={{ color: COLORS.inkSoft }}>
              Mobile Number
            </p>
            <p className="text-[13.5px] font-bold m-0 mt-0.5" style={{ color: COLORS.ink }}>
              {client.phone}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: COLORS.blush }}
          >
            <MapPin size={15} style={{ color: COLORS.maroon }} />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider m-0" style={{ color: COLORS.inkSoft }}>
              Address
            </p>
            <p className="text-[13px] font-semibold m-0 mt-0.5 leading-snug" style={{ color: COLORS.ink }}>
              {client.address}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ─── Single timeline card ────────────────────────────────────────────────
const TimelineCard = ({ fn, side, visible }) => {
  const Icon = fn.icon;
  const fromLeft = side === "left";
  return (
    <div
      className="rounded-2xl border bg-white p-4 sm:p-5 transition-all duration-700 ease-out hover:shadow-lg hover:-translate-y-0.5"
      style={{
        borderColor: "rgba(58,42,38,0.08)",
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateY(0) translateX(0)"
          : `translateY(14px) translateX(${fromLeft ? "-16px" : "16px"})`,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p
            className="text-[10px] font-bold uppercase tracking-[0.14em] m-0"
            style={{ color: COLORS.gold }}
          >
            Function 0{fn.id}
          </p>
          <h3
            className="m-0 mt-0.5 font-semibold"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: COLORS.maroon2 }}
          >
            {fn.title}
          </h3>
        </div>
        <span
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: COLORS.blush }}
        >
          <Icon size={16} style={{ color: COLORS.maroon }} />
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3">
        <span className="flex items-center gap-1.5 text-[12.5px] font-semibold" style={{ color: COLORS.ink }}>
          <Calendar size={12} style={{ color: COLORS.gold }} /> {fn.date}
          <span style={{ color: COLORS.inkSoft }} className="font-medium">
            · {fn.day}
          </span>
        </span>
        <span className="flex items-center gap-1.5 text-[12.5px] font-semibold" style={{ color: COLORS.ink }}>
          <Clock size={12} style={{ color: COLORS.gold }} /> {fn.time}
        </span>
      </div>

      <div className="flex items-center gap-1.5 mt-1.5">
        <MapPin size={12} style={{ color: COLORS.gold }} />
        <p className="text-[12.5px] font-semibold m-0" style={{ color: COLORS.ink }}>
          {fn.venue} <span style={{ color: COLORS.inkSoft }} className="font-medium">— {fn.venueSub}</span>
        </p>
      </div>

      {/* <div
        className="flex items-center justify-between mt-3.5 pt-3 border-t"
        style={{ borderColor: "rgba(58,42,38,0.07)" }}
      >
        <div className="flex items-center gap-3.5">
          <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: COLORS.inkSoft }}>
            <Users size={12} /> {fn.guests}
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: COLORS.inkSoft }}>
            <FileText size={12} /> Notes
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: COLORS.inkSoft }}>
            <ImageIcon size={12} /> Gallery
          </span>
        </div>
        <ChevronRight size={15} style={{ color: COLORS.gold }} />
      </div> */}
      <p className="text-[11.5px] italic mt-2 m-0" style={{ color: COLORS.inkSoft }}>
        {fn.note}
      </p>
    </div>
  );
};

// ─── Itinerary section: center line + alternating cards ─────────────────
const Itinerary = ({ functions }) => {
  const wrapRef = useRef(null);
  const [fillPct, setFillPct] = useState(0);
  const [visibleMap, setVisibleMap] = useState({});
  const itemRefs = useRef([]);

  const onScroll = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.85;
    const total = rect.height + vh * 0.3;
    const progressed = start - rect.top;
    const pct = Math.min(100, Math.max(0, (progressed / total) * 100));
    setFillPct(pct);
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onScroll]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.dataset.idx);
            setVisibleMap((prev) => (prev[idx] ? prev : { ...prev, [idx]: true }));
          }
        });
      },
      { threshold: 0.25, rootMargin: "0px 0px -60px 0px" },
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div>
      <div className="text-center mb-8 sm:mb-12">
        <p
          className="text-[11px] font-bold uppercase tracking-[0.26em] m-0"
          style={{ color: COLORS.gold }}
        >
          Five Celebrations · One Story
        </p>
        <h2
          className="m-0 mt-1.5 font-semibold"
          style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.7rem, 3.4vw, 2.4rem)", color: COLORS.maroon2 }}
        >
          Functions &amp; Itinerary
        </h2>
      </div>

      <div ref={wrapRef} className="relative">
        {/* center line — desktop */}
        <div
          className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[3px] -translate-x-1/2 rounded-full"
          style={{ background: "rgba(199,154,75,0.22)" }}
        >
          <div
            className="w-full rounded-full transition-[height] duration-150 ease-out"
            style={{
              height: `${fillPct}%`,
              background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.maroon})`,
            }}
          />
        </div>
        {/* line — mobile (left aligned) */}
        <div
          className="md:hidden absolute left-[19px] top-0 bottom-0 w-[3px] rounded-full"
          style={{ background: "rgba(199,154,75,0.22)" }}
        >
          <div
            className="w-full rounded-full transition-[height] duration-150 ease-out"
            style={{
              height: `${fillPct}%`,
              background: `linear-gradient(180deg, ${COLORS.gold}, ${COLORS.maroon})`,
            }}
          />
        </div>

        {functions.length === 0 && (
          <div className="text-center py-12" style={{ color: COLORS.inkSoft }}>
            No functions added yet for this event.
          </div>
        )}

        <div className="flex flex-col gap-8 md:gap-4">
          {functions.map((fn, idx) => {
            const Icon = fn.icon;
            const isLeft = idx % 2 === 0;
            const visible = !!visibleMap[idx];
            return (
              <div
                key={fn.id}
                ref={(el) => (itemRefs.current[idx] = el)}
                data-idx={idx}
                className="relative md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-6"
              >
                {/* mobile node */}
                <div className="md:hidden flex gap-4 pl-0">
                  <div className="relative shrink-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center border-4 transition-transform duration-500"
                      style={{
                        background: COLORS.maroon,
                        borderColor: COLORS.canvas,
                        boxShadow: "0 0 0 2px rgba(199,154,75,0.5)",
                        transform: visible ? "scale(1)" : "scale(0.6)",
                      }}
                    >
                      <Icon size={16} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <TimelineCard fn={fn} side="right" visible={visible} />
                  </div>
                </div>

                {/* desktop left slot */}
                <div className="hidden md:block">
                  {isLeft ? <TimelineCard fn={fn} side="left" visible={visible} /> : <div />}
                </div>

                {/* desktop center node */}
                <div className="hidden md:flex items-center justify-center relative">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center border-[5px] transition-transform duration-500"
                    style={{
                      background: COLORS.maroon,
                      borderColor: COLORS.canvas,
                      boxShadow: "0 0 0 2px rgba(199,154,75,0.5)",
                      transform: visible ? "scale(1)" : "scale(0.55)",
                    }}
                  >
                    <Icon size={18} className="text-white" />
                  </div>
                </div>

                {/* desktop right slot */}
                <div className="hidden md:block">
                  {!isLeft ? <TimelineCard fn={fn} side="right" visible={visible} /> : <div />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ─── Footer flourish ──────────────────────────────────────────────────────
const Footer = () => (
  <div
    className="rounded-2xl p-8 sm:p-10 text-center relative overflow-hidden"
    style={{ background: `linear-gradient(135deg, ${COLORS.maroon}, ${COLORS.maroon2})` }}
  >
    <Heart size={18} style={{ color: COLORS.gold }} fill={COLORS.gold} className="mx-auto mb-3" />
    <p
      className="m-0 font-semibold"
      style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(1.4rem, 2.6vw, 1.9rem)", color: COLORS.goldSoft }}
    >
      Creating memories that last a lifetime.
    </p>
    <p className="m-0 mt-1 text-[13px]" style={{ color: "rgba(233,213,166,0.8)" }}>
      Let the celebrations begin ✦
    </p>
  </div>
);

// ─── Loading / error states ─────────────────────────────────────────────
const StateScreen = ({ children }) => (
  <div
    className="min-h-screen w-full flex items-center justify-center"
    style={{ background: COLORS.canvas, fontFamily: "'Manrope', sans-serif" }}
  >
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=Manrope:wght@400;500;600;700;800&display=swap');
    `}</style>
    {children}
  </div>
);

// ─── Page ──────────────────────────────────────────────────────────────────
export default function EventOverviewPage() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");

  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [rawResponse, setRawResponse] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!eventId) {
        setStatus("error");
        return;
      }
      setStatus("loading");
      try {
        const res = await getbyeventid(eventId);
        if (cancelled) return;
        if (res?.data?.success === false) {
          setStatus("error");
          return;
        }
        setRawResponse(res);
        setStatus("ready");
      } catch (err) {
        console.error("Failed to load event overview", err);
        if (!cancelled) setStatus("error");
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const { event, client, functions } = useMemo(
    () => (rawResponse ? mapEventResponse(rawResponse) : { event: null, client: null, functions: [] }),
    [rawResponse],
  );

  if (status === "loading") {
    return (
      <StateScreen>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-9 h-9 rounded-full border-4 animate-spin"
            style={{ borderColor: COLORS.goldSoft, borderTopColor: COLORS.maroon }}
          />
          <p className="text-sm font-semibold" style={{ color: COLORS.inkSoft }}>
            Loading event overview…
          </p>
        </div>
      </StateScreen>
    );
  }

  if (status === "error" || !event) {
    return (
      <StateScreen>
        <div className="text-center max-w-sm px-6">
          <p
            className="font-semibold m-0"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", color: COLORS.maroon2 }}
          >
            We couldn't load this event
          </p>
          <p className="text-sm mt-2 m-0" style={{ color: COLORS.inkSoft }}>
            {eventId
              ? "Something went wrong fetching the event details. Please try again."
              : "No event was specified in the link."}
          </p>
        </div>
      </StateScreen>
    );
  }

  return (
    <div className="min-h-screen w-full" style={{ background: COLORS.canvas, fontFamily: "'Manrope', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,600&family=Manrope:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col gap-8 sm:gap-10">
        <Hero event={event} />
        <Flourish />
        <ClientDetails client={client} />
        <Itinerary functions={functions} />
        <Footer />
      </div>
    </div>
  );
}