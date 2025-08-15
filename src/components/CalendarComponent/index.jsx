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
import AddEvent from "@/partials/modals/add-event/AddEvent";
import { useState } from "react";

const CalendarComponent = ({ data, openEvent, handleDateClick }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  
  const classes = useStyles();
const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  return (
    <div className={`${classes.fullCalendar} fullCalendarCommon`}>

      {/* Add Event Button */}
      <div style={{ marginBottom: "10px", textAlign: "right" }}>
        
          <button
              className="btn bg-[#845A12] text-white hover:bg-[#6f4c12]"
              onClick={handleModalOpen}
              title="Add Contact"
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
   
            <AddEvent
              isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        editData={editData}
            />
         
    </div>
  );
};

export default CalendarComponent;
