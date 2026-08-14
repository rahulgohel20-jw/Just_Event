import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import useStyles from "./style";

// Event creation now happens on the /creteevnetname route (see CalendarPage),
// so this component no longer owns an AddEvent modal — it just surfaces the
// date click and the Add Event button click to the parent.
const CalendarComponent = ({ data, openEvent, handleDateClick, onAddEventClick, loading }) => {
  const classes = useStyles();

  return (
    <div className={`${classes.fullCalendar} fullCalendarCommon`}>
      {/* Add Event Button */}
      <div style={{ marginBottom: "10px", textAlign: "right" }}>
        <button
          className="btn bg-primary text-white"
          onClick={onAddEventClick}
          title="Add Event"
          disabled={loading}
        >
          <i className="ki-filled ki-plus"></i> Add Event
        </button>
      </div>

      <FullCalendar
        events={data}
        eventClick={(e) => openEvent(e)}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          interactionPlugin,
        ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,timeGridDay,listWeek",
        }}
        buttonText={{
          today: "Today",
          dayGridMonth: "Month",
          dayGridWeek: "Week",
          timeGridDay: "Day",
          listWeek: "List",
        }}
        dateClick={handleDateClick}
        eventDidMount={(info) => {
          const { event, el } = info;
          const time = event.extendedProps.time || "";
          const event_name = event.extendedProps.event_name || "";
          const address = event.extendedProps.address || "";
          const mobile = event.extendedProps.mobile || "";

          tippy(el, {
            content: `
              <strong>${event.title}</strong><br/>
              Event: ${event_name}<br/>
              Time: ${time}<br/>
              Address: ${address}<br/>
              Mobile: ${mobile}
            `,
            allowHTML: true,
            theme: 'light',
          });
        }}
      />
    </div>
  );
};

export default CalendarComponent;