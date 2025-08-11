import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import useStyles from "./style";
import { Button } from "@mui/material"; // or your preferred button component
import { Link } from "react-router-dom"; // assuming you're using React Router

const CalendarComponent = ({ data, openEvent, handleDateClick }) => {
  const classes = useStyles();

  return (
    <div className={`${classes.fullCalendar} fullCalendarCommon`}>

      {/* Add Event Button */}
      <div style={{ marginBottom: "10px", textAlign: "right" }}>
        <Link to="/add-event" style={{ textDecoration: "none" }}>
          <Button variant="contained" className=" text-white hover:bg-[#845A12]">
            Add Event
          </Button>
        </Link>
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
          const address = event.extendedProps.address || "";
          const mobile = event.extendedProps.mobile || "";

          tippy(el, {
            content: `
              <strong>${event.title}</strong><br/>
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
