import React, { useState } from "react";
import {
  Sparkles,
  ChevronDown,
  ArrowRight,
  Heart,
  Briefcase,
  Cake,
  PartyPopper,
  Music,
  GraduationCap,
  Trophy,
  Clock,
  MessageCircleQuestion,
} from "lucide-react";

// Absolute import — swap for the actual illustration asset once provided
import illustrationImg from "@/assets/create-event-illustration.png";

const EVENT_TYPES = [
  { id: "wedding", label: "Wedding", icon: Heart },
  { id: "corporate", label: "Corporate", icon: Briefcase },
  { id: "birthday", label: "Birthday", icon: Cake },
  { id: "anniversary", label: "Anniversary", icon: PartyPopper },
  { id: "babyShower", label: "Baby Shower", icon: PartyPopper },
  { id: "concert", label: "Concert", icon: Music },
  { id: "graduation", label: "Graduation", icon: GraduationCap },
  { id: "award", label: "Award", icon: Trophy },
  { id: "other", label: "Other", icon: Sparkles },
];

const PRIORITIES = ["High", "Med", "Low"];

export default function CreateEventName() {
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("wedding");
  const [eventDate, setEventDate] = useState("");
  const [leadSource, setLeadSource] = useState("Website");
  const [priority, setPriority] = useState("High");

  const canSubmit = eventName.trim().length > 0;

  const handleCreateWorkspace = () => {
    if (!canSubmit) return;
    // integrate with API service layer here
    console.log({ eventName, eventType, eventDate, leadSource, priority });
  };

  return (
    <div className="min-h-screen ">
      <main className="px-8 grid grid-cols-1 xl:grid-cols-[1fr_1.3fr] gap-6 items-start w-full">
          {/* Left: illustration card */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <div className="rounded-xl overflow-hidden bg-rose-50 mb-6">
              <img
                src={illustrationImg}
                alt="Event planner illustration"
                className="w-full h-auto object-cover"
              />
            </div>
            <h2 className="text-6xl  text-primary mb-3">
              Plan Extraordinary Events
            </h2>
            <p className="text-2xl  leading-relaxed mb-5">
              Create your event workspace and manage clients, functions,
              venues, budgets, vendors, and timelines effortlessly from one
              centralized dashboard.
            </p>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full bg-rose-200 border-2 border-white"
                  />
                ))}
              </div>
              <span className="text-xs text-rose-500">
                Joined by 2,000+ top event planners
              </span>
            </div>
          </section>

          {/* Right: form card */}
          <section className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-3xl font-bold text-[#350D1B] ">
              Create New Event
            </p>
            <p className="text-xl text-[#554246]  mb-6">
              Let's start by giving your event a name and selecting the type
              of event you're planning.
            </p>

            {/* Event name */}
            <label className="block text-[15px] font-semibold tracking-wide  mb-2">
              EVENT NAME
            </label>
            <div className="relative mb-6">
              <Sparkles className="w-4 h-4 text-rose-300 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="e.g. Rahul & Priya Wedding"
                className="w-full border border-gray-300 rounded-xl pl-9 pr-4 py-3 text-sm   outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Event type */}
            <label className="block text-[15px] font-semibold tracking-wide  mb-2">
              EVENT TYPE
            </label>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {EVENT_TYPES.map(({ id, label, icon: Icon }) => {
                const active = eventType === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setEventType(id)}
                    className={`flex flex-col items-center justify-center gap-2 rounded-xl border py-4 text-xs font-medium transition-colors ${
                      active
                        ? "border-rose-300 bg-rose-50 "
                        : "border-gray-300 "
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        active ? "text-rose-700" : "text-rose-400"
                      }`}
                    />
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Date + lead source */}
         <div className="grid grid-cols-1 gap-4 mb-6">
  <div>
    <label className="block text-[15px] font-semibold tracking-wide mb-2">
      EVENT DATE
    </label>

    <input
      type="date"
      value={eventDate}
      onChange={(e) => setEventDate(e.target.value)}
      onClick={(e) => e.target.showPicker?.()}
      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:outline-none focus:ring-0 focus:border-gray-300 cursor-pointer"
    />
  </div>
</div>

            {/* Priority */}
            <label className="block text-[15px] font-semibold tracking-wide  mb-2">
              PRIORITY
            </label>
            <div className="flex bg-rose-50/60 border border-gray-300 rounded-xl p-1 mb-6">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                    priority === p
                      ? "bg-rose-900 text-white shadow-sm"
                      : "text-black-500 hover:text-rose-700"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Workspace preview */}
            {/* <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold tracking-wider text-rose-500">
                  WORKSPACE PREVIEW
                </span>
                <span className="text-[10px] font-semibold text-rose-400 bg-white px-2 py-0.5 rounded-full">
                  DRAFT
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shrink-0">
                  <Heart className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-rose-950">
                    {eventName || "New Workspace"}
                  </p>
                  <p className="text-xs text-rose-400">Created by Sarah Jenkins</p>
                </div>
              </div>
            </div> */}

            {/* Submit */}
            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleCreateWorkspace}
              className={`w-full rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                canSubmit
                  ? "bg-rose-900 hover:bg-rose-950 text-white"
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