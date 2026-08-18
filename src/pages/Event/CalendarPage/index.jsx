import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useNavigate } from "react-router-dom";
import { CalendarPlus, CalendarCheck, Plus } from "lucide-react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import CalendarComponent from "@/components/CalendarComponent";
import EventViewModal from "@/partials/modals/calendar-event/EventView";
import { getallevent } from "@/services/apiServices";
import { showApiError } from "@/utils/swalHelpers";

dayjs.extend(customParseFormat);

const toCalendarDate = (raw) => {
  if (!raw) return null;
  const formats = ["YYYY-MM-DD", "DD/MM/YYYY", "YYYY-MM-DDTHH:mm:ss"];
  for (const fmt of formats) {
    const parsed = dayjs(raw, fmt, true);
    if (parsed.isValid()) return parsed.format("YYYY-MM-DD");
  }
  const fallback = dayjs(raw);
  return fallback.isValid() ? fallback.format("YYYY-MM-DD") : null;
};


const mapEventToCalendar = (item) => {
  const start = toCalendarDate(item.eventStartDate || item.inquiryDate);
  if (!start) return null;

  const projectName = item.projectName || "";
  const eventName = item.eventNameEnglish || "";
  const title =
    projectName && eventName
      ? `${projectName} (${eventName})`
      : projectName || eventName || "Event";

  const status = item.eventStatus || "";
  const color = getStatusColor(status);

  return {
    id: item.id,
    title,
    start,
    backgroundColor: color,
    borderColor: color,
    textColor: "#ffffff",
    extendedProps: {
      time: item.eventStartTime || "",
      event_name: eventName || projectName,
      address: item.venueNameEnglish || item.venueAddress || "",
      mobile: item.partyMobile || item.mobileNo || "",
      status,
      raw: item,
    },
  };
};


const STATUS_FILTERS = [
  { value: "INQUIRY", label: "Inquiry" },
  { value: "TENTATIVE", label: "Tentative" },
  { value: "CONFIRM", label: "Confirm" },
  { value: "CANCEL", label: "Cancel" },
];

const STATUS_COLORS = {
  INQUIRY: "#3b82f6",   // blue-500
  TENTATIVE: "#6b7280", // gray-500
  CONFIRM: "#22c55e",   // green-500
  CANCEL: "#dc2626",    // red-600
};

const getStatusColor = (status) => STATUS_COLORS[status] || "#9ca3af"; // gray-400 fallback for truly unknown/null status
const CalendarPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventModalData, setEventModalData] = useState(null);

  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeStatus, setActiveStatus] = useState(null); 
  const [typeFilter, setTypeFilter] = useState("All");  

  const fetchCalendarEvents = useCallback(async () => {
    setLoading(true);
    try {
      const userId = Number(localStorage.getItem("userId")) || null;

      const payload = {
        eventStatus: null,
        eventTypeId: null,
        FormData: null,
        page: 0,
        partyId: null,
        priority: null,
        search: "",
        size: 1000,
        sortBy: "id",
        sortDirection: "DESC",
        toDate: null,
        userId,
        venueId: null,
      };

      const res = await getallevent(payload);
      const body = res?.data;

      if (body?.success) {
        const content = body?.data?.content || [];
        setCalendarEvents(content.map(mapEventToCalendar).filter(Boolean));
      } else {
        setCalendarEvents([]);
      }
    } catch (err) {
      showApiError(err, { title: "Failed to Load Events" });
      setCalendarEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCalendarEvents();
  }, [fetchCalendarEvents]);

  // Client-side filter by chip selection. Swap for a server-side
  // eventStatus param on fetchCalendarEvents if the list can get large.
  const visibleEvents = useMemo(() => {
    if (!activeStatus) return calendarEvents;
    return calendarEvents.filter(
      (ev) => ev.extendedProps?.status === activeStatus
    );
  }, [calendarEvents, activeStatus]);

  const openEvent = (clickInfo) => {
    setEventModalData(clickInfo.event.extendedProps.raw || null);
    setIsModalOpen(true);
  };

  const goToCreateEvent = (eventDate) => {
    navigate("/creteevnetname", { state: { eventDate } });
  };

  const handleDateClick = (info) => {
    goToCreateEvent(info.dateStr);
  };

  const handleAddEventClick = () => {
    goToCreateEvent(dayjs().format("YYYY-MM-DD"));
  };

  const toggleStatus = (value) => {
    setActiveStatus((prev) => (prev === value ? null : value));
  };

  return (
    <Fragment>
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 mb-4">
          {/* Status legend / filter chips */}
          <div className="flex flex-wrap items-center gap-2">
           {STATUS_FILTERS.map((s) => (
  <button
    key={s.value}
    type="button"
    onClick={() => toggleStatus(s.value)}
    style={{
      backgroundColor: STATUS_COLORS[s.value],
      opacity: activeStatus && activeStatus !== s.value ? 0.5 : 1,
    }}
    className="rounded-lg px-4 py-2 text-sm text-white transition-opacity"
    title={`Filter by ${s.label}`}
  >
    {s.label}
  </button>
))}
          </div>

          {/* Right-side controls */}
          <div className="flex flex-wrap items-center gap-2">
          

           

           

            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-rose-950"
              onClick={handleAddEventClick}
              title="Add Event"
            >
              <Plus size={16} />
              Add Event
            </button>
          </div>
        </div>

        <CalendarComponent
          data={visibleEvents}
          loading={loading}
          openEvent={openEvent}
          handleDateClick={handleDateClick}
          onAddEventClick={handleAddEventClick}
        />
      </Container>

      {isModalOpen && (
        <EventViewModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          eventData={eventModalData}
          onDeleted={fetchCalendarEvents}
        />
      )}
    </Fragment>
  );
};

export default CalendarPage;