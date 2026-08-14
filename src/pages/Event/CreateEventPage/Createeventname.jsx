import React, { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Search,
  Loader2,
} from "lucide-react";
import dayjs from "dayjs";

import illustrationImg from "../../../assets/create-event-img.png";
import { useNavigate, useLocation } from "react-router";
import { getAllEventTypemaster } from "@/services/apiServices";
import DateField from "../../../components/form-inputs/DatePicker/Datefield";
import { useEventDraftStore } from "@/stores/useEventDraftStore";

const PAGE_SIZE = 9;
const PRIORITIES = ["High", "Med", "Low"];

export default function CreateEventName() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    eventName, setEventName,
    eventType, setEventType,
    eventDate, setEventDate,
    priority, setPriority,
     venue, setVenue,
  } = useEventDraftStore();


  useEffect(() => {
  const incomingDate = location.state?.eventDate;
  if (!incomingDate) return;

  const parsed = dayjs(incomingDate, "YYYY-MM-DD", true);
  if (parsed.isValid()) {
    setEventDate(parsed.format("DD/MM/YYYY"));
  }
 
}, [location.state?.eventDate]);



  // ---- Event Type list (local — not shared state) ----
  const [eventTypes, setEventTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const debounceRef = useRef(null);

  const fetchEventTypes = async (pageToFetch, search, append = false) => {
    if (append) setLoadingMore(true);
    else setLoadingTypes(true);

    try {
      const res = await getAllEventTypemaster({
        nameEnglish: search || "",
        page: pageToFetch,
        size: PAGE_SIZE,
        sortBy: "id",
        sortDirection: "DESC",
      });
      const body = res?.data ?? res;
      const pageData = body?.data ?? body;
      const records = pageData?.content ?? [];

      setEventTypes((prev) => (append ? [...prev, ...records] : records));
      setTotalPages(pageData?.totalPages ?? 0);
      setPage(pageToFetch);
    } catch (err) {
      console.error("Failed to fetch event types:", err);
      if (!append) setEventTypes([]);
    } finally {
      setLoadingTypes(false);
      setLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchEventTypes(0, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search — resets to page 0 on every new search term
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchEventTypes(0, searchTerm);
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [searchTerm]);

  const handleShowMore = () => {
    fetchEventTypes(page + 1, searchTerm, true);
  };

  const canSubmit = eventName.trim().length > 0;
const resetDraft = () => {
    setEventName("");
    setEventType(null);
    setEventDate("");
    setPriority("Med");
    setVenue(null);
    setSearchTerm("");
  };

 const handleCreateWorkspace = () => {
  setSearchTerm(""); // local search input only — safe, doesn't touch the shared draft
  navigate("/creteEvent");
};
  

  const hasMore = page + 1 < totalPages;

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(1200px 500px at 15% -10%, #FFE4E9 0%, rgba(255,228,233,0) 60%), linear-gradient(180deg, #FFF8F6 0%, #FFFFFF 100%)",
      }}
    >
      <style>{`input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.55; cursor: pointer; filter: invert(28%) sepia(45%) saturate(2000%) hue-rotate(315deg); }
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
            Create your event workspace and manage clients, functions, venues,
            budgets, vendors, and timelines effortlessly from one centralized
            dashboard.
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
           PROJECT NAME
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[12px] font-bold tracking-wider text-[#8A6A70]">
              EVENT TYPE
            </label>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="w-4 h-4 text-rose-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search event type..."
              className="w-full border border-rose-100 bg-rose-50/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#350D1B] placeholder:text-[#B99299] outline-none transition-shadow focus:ring-2 focus:ring-gray-200 focus:border-gray-300"
            />
          </div>

          {loadingTypes ? (
            <div className="flex items-center justify-center py-8 mb-7">
              <Loader2 className="w-5 h-5 animate-spin text-rose-400" />
            </div>
          ) : eventTypes.length === 0 ? (
            <div className="text-center py-8 mb-7 text-sm text-[#8A6A70]">
              No event types found.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2.5 mb-3 max-h-[340px] overflow-y-auto pr-1">
                {eventTypes.map((type) => {
                  const active = eventType?.id === type.id;
                  return (
                   <button
  key={type.id}
  type="button"
  onClick={() =>
    setEventType({ value: type.id, label: type.nameEnglish, ...type })
  }
  aria-pressed={active}
  className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl border py-3.5 px-1.5 text-[12px] font-medium transition-all ${
    active
      ? "border-rose-300 bg-rose-50 shadow-sm"
      : "border-[#EFE3E5] hover:border-rose-200 hover:bg-rose-50/40"
  }`}
>
                      {type.imgPath ? (
                        <img
                          src={type.imgPath}
                          alt={type.nameEnglish}
                          className="w-[22px] h-[22px] object-contain rounded"
                        />
                      ) : (
                        <Sparkles
                          className={`w-[18px] h-[18px] ${
                            active ? "text-rose-700" : "text-rose-300"
                          }`}
                        />
                      )}
                      <span
                        className={`text-center truncate w-full ${
                          active ? "text-[#350D1B]" : "text-[#7A5F64]"
                        }`}
                      >
                        {type.nameEnglish}
                      </span>
                    </button>
                  );
                })}
              </div>

              {hasMore && (
                <div className="flex justify-center mb-7">
                  <button
                    type="button"
                    onClick={handleShowMore}
                    disabled={loadingMore}
                    className="text-xs font-semibold text-rose-700 hover:underline disabled:opacity-60 flex items-center gap-1.5"
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Show More"
                    )}
                  </button>
                </div>
              )}
              {!hasMore && <div className="mb-7" />}
            </>
          )}

          {/* Date */}
        <div className="mb-7">
            <DateField
              label="EVENT DATE"
              value={eventDate}
              onChange={setEventDate}
              placeholder="DD/MM/YYYY"
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
                className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${priority === p
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
            // disabled={!canSubmit}
            onClick={handleCreateWorkspace}
            className={`w-full rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${canSubmit
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