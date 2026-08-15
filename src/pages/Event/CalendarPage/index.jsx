import React, { Fragment, useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import CalendarComponent from "@/components/CalendarComponent";
import EventViewModal from "@/partials/modals/calendar-event/EventView";
import { getallevent } from "@/services/apiServices";
import { showApiError } from "@/utils/swalHelpers";

dayjs.extend(customParseFormat);

// FullCalendar wants "YYYY-MM-DD". This codebase's event date fields have
// shown up in more than one format elsewhere (see the your-journey-connect
// eventDate fix), so try the shapes we've actually seen before falling back
// to a loose dayjs parse.
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

// NOTE: address/mobile field names are guesses (venueNameEnglish/venueAddress,
// partyMobile/mobileNo) — swap these for whatever getallevent actually
// returns; I don't have the real response shape to confirm against.
const mapEventToCalendar = (item) => {
  const start = toCalendarDate(item.eventStartDate || item.inquiryDate);
  if (!start) return null;

  return {
    id: item.id,
    title: item.partyNameEnglish || item.eventNameEnglish || item.projectName || "Event",
    start,
    extendedProps: {
      time: item.eventStartTime || "",
      event_name: item.eventNameEnglish || item.projectName || "",
      address: item.venueNameEnglish || item.venueAddress || "",
      mobile: item.partyMobile || item.mobileNo || "",
      raw: item,
    },
  };
};

const CalendarPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventModalData, setEventModalData] = useState(null);

  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const statuses = [
    { label: "Confirm", color: "bg-[#1AFF00]" },
    { label: "Estimate", color: "bg-[#0011FF]" },
    { label: "High Priority", color: "bg-[#FFB700]" },
    { label: "Inquiry", color: "bg-[#00FFFF]" },
    { label: "Cancel", color: "bg-[#FF0000]" },
  ];

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
        // Calendar needs the full set, not one paginated page — bump size
        // well above any realistic event count. Swap for a dedicated
        // "all events" endpoint if one exists on the backend.
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

  const openEvent = (clickInfo) => {
    setEventModalData(clickInfo.event.extendedProps.raw || null);
    setIsModalOpen(true);
  };

  const goToCreateEvent = (eventDate) => {
    navigate("/creteevnetname", {
      state: { eventDate },
    });
  };

 const handleDateClick = (info) => {
  goToCreateEvent(info.dateStr);
};

  // No date was clicked, so default to today.
  const handleAddEventClick = () => {
    goToCreateEvent(dayjs().format("YYYY-MM-DD"));
  };

  return (
    <Fragment>
      <Container>
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Events" }]} />
        </div>

        <CalendarComponent
          data={calendarEvents}
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
        />
      )}
    </Fragment>
  );
};

export default CalendarPage;