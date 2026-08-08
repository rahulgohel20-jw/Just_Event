import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Heart,
  Briefcase,
  Cake,
  Gift,
  PartyPopper,
  Music,
  GraduationCap,
  Trophy,
  Calendar,
} from "lucide-react";

import illustrationImg from "../../../assets/create-event-img.png";

const EVENT_TYPES = [
  { id: "wedding", label: "Wedding", icon: Heart },
  { id: "corporate", label: "Corporate", icon: Briefcase },
  { id: "birthday", label: "Birthday", icon: Cake },
  { id: "anniversary", label: "Anniversary", icon: Gift },
  { id: "babyShower", label: "Baby Shower", icon: PartyPopper },
  { id: "concert", label: "Concert", icon: Music },
  { id: "graduation", label: "Graduation", icon: GraduationCap },
  { id: "award", label: "Awards", icon: Trophy },
  { id: "other", label: "Other", icon: Sparkles },
];

const PRIORITIES = ["High", "Med", "Low"];

export default function CreateEventName() {
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("wedding");
  const [eventDate, setEventDate] = useState("");
  const [priority, setPriority] = useState("High");

  const canSubmit = eventName.trim().length > 0;

  const handleCreateWorkspace = () => {
    if (!canSubmit) return;
    console.log({ eventName, eventType, eventDate, priority });
  };

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(1200px 500px at 15% -10%, #FFE4E9 0%, rgba(255,228,233,0) 60%), linear-gradient(180deg, #FFF8F6 0%, #FFFFFF 100%)",
      }}
    >
      <style>{`
        
       
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.55; cursor: pointer; filter: invert(28%) sepia(45%) saturate(2000%) hue-rotate(315deg); }
      `}</style>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10 grid grid-cols-1 xl:grid-cols-[1fr_1.15fr] gap-5 md:gap-6 items-start">
        {/* Left: illustration card */}
        <section className="bg-white rounded-3xl shadow-[0_8px_40px_-12px_rgba(190,18,60,0.12)] p-7 md:p-8 border border-rose-50">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-600 text-[11px] font-semibold tracking-wide px-3 py-1 mb-6">
            <Sparkles className="w-3 h-3" />
            NEW WORKSPACE
          </span>

          <div className="rounded-2xl overflow-hidden bg-rose-50 mb-7 relative">
            <img
              src={illustrationImg}
              alt="Illustration of an event planner reviewing a tablet in front of a decorated floral arch, surrounded by planning cards and color swatches"
              className="w-full h-auto object-cover block"
            />
          </div>

          <h1 className="font-display text-3xl md:text-4xl leading-[1.1] tracking-tight mb-3 text-[#1C1015]">
            <span className="text-rose-800">Plan Extraordinary</span>
            <br />
            Events with Precision
          </h1>
          <p className="text-[15px] leading-relaxed text-[#6B5257] mb-6 max-w-md">
            Create your event workspace and manage clients, functions,
            venues, budgets, vendors, and timelines effortlessly from one
            centralized dashboard.
          </p>

          <div className="flex items-center gap-3 pt-5 mt-1 border-t border-rose-50">
            <div className="flex -space-x-2.5 shrink-0">
              {["#FDA4AF", "#FB7185", "#881337"].map((c, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-semibold text-white"
                  style={{ backgroundColor: c }}
                >
                  {["SJ", "RK", "AL"][i]}
                </div>
              ))}
            </div>
            <p className="text-[13px] leading-snug text-[#6B5257] italic">
              "The most intuitive event platform I've ever used."
            </p>
          </div>
        </section>

        {/* Right: form card */}
        <section className="bg-white rounded-3xl shadow-[0_8px_40px_-12px_rgba(190,18,60,0.12)] p-7 md:p-8 border border-rose-50 self-start">
          <h2 className="font-display text-2xl font-bold text-[#350D1B] mb-1.5">
            Start Your Journey
          </h2>
          <p className="text-[15px] text-[#6B5257] mb-7">
            Fill in the core details to initialize your workspace.
          </p>

          {/* Event name */}
          <label className="block text-[12px] font-bold tracking-wider text-[#8A6A70] mb-2">
            EVENT NAME
          </label>
          <div className="relative mb-7">
            <Sparkles className="w-4 h-4 text-primary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Rahul & Priya Wedding"
              className="w-full border border-rose-100 bg-rose-50/30 rounded-xl pl-10 pr-4 py-3 text-sm text-[#350D1B] placeholder:text-[#B99299] outline-none transition-shadow focus:ring-2 focus:ring-gray-200 focus:border-gray-300"
            />
          </div>

          {/* Event type */}
          <label className="block text-[12px] font-bold tracking-wider text-[#8A6A70] mb-2">
            EVENT CATEGORY
          </label>
          <div className="grid grid-cols-3 gap-2.5 mb-7">
            {EVENT_TYPES.map(({ id, label, icon: Icon }) => {
              const active = eventType === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setEventType(id)}
                  aria-pressed={active}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border py-3.5 text-[12px] font-medium transition-all ${
                    active
                      ? "border-rose-300 bg-rose-50 shadow-sm"
                      : "border-[#EFE3E5] hover:border-rose-200 hover:bg-rose-50/40"
                  }`}
                >
                  <Icon
                    className={`w-[18px] h-[18px] ${
                      active ? "text-rose-700" : "text-rose-300"
                    }`}
                  />
                  <span className={active ? "text-[#350D1B]" : "text-[#7A5F64]"}>
                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Date */}
          <label className="block text-[12px] font-bold tracking-wider text-[#8A6A70] mb-2">
            EVENT DATE
          </label>
          <div className="relative mb-7">
            <Calendar className="w-4 h-4 text-rose-300 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              onClick={(e) => e.target.showPicker?.()}
              className="w-full border border-rose-100 bg-rose-50/30 rounded-xl pl-10 pr-4 py-3 text-sm text-[#350D1B] outline-none cursor-pointer transition-shadow focus:ring-2 focus:ring-rose-200 focus:border-rose-300"
            />
          </div>

          {/* Priority */}
          <label className="block text-[12px] font-bold tracking-wider text-[#8A6A70] mb-2">
            PRIORITY
          </label>
          <div className="flex bg-rose-50/50 border border-rose-100 rounded-xl p-1 mb-8">
            {PRIORITIES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                aria-pressed={priority === p}
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                  priority === p
                    ? "bg-primary text-white shadow-sm"
                    : "text-[#8A6A70] hover:text-rose-800"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Submit */}
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleCreateWorkspace}
            className={`w-full rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              canSubmit
                ? "bg-primary hover:bg-rose-950 text-white"
                : "bg-rose-200 text-white cursor-not-allowed"
            }`}
          >
            Create Event Workspace <ArrowRight className="w-4 h-4" />
          </button>
        </section>
      </main>
    </div>
  );
}