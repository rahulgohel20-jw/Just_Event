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

  return {
    id: item.id,
    title,
    start,
    extendedProps: {
      time: item.eventStartTime || "",
      event_name: eventName || projectName,
      address: item.venueNameEnglish || item.venueAddress || "",
      mobile: item.partyMobile || item.mobileNo || "",
      status: item.eventStatus || "", 
      raw: item,
    },
  };
};


const STATUS_FILTERS = [
  { value: "INQUIRY", label: "Inquiry", className: "bg-blue-500 text-white" },
  { value: "CONFIRMED", label: "Confirm", className: "bg-green-500 text-white" },
  { value: "CANCELLED", label: "Cancel", className: "bg-red-600 text-white" },
];

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
                className={`rounded-lg px-4 py-2 text-sm  transition-opacity ${s.className} ${
                  activeStatus && activeStatus !== s.value ? "opacity-50" : ""
                }`}
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