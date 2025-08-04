import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import useStyles from "./style";
const CalendarComponent = ({ data, openEvent, handleDateClick }) => {
  const classes = useStyles();
  return (
    <div className={`${classes.fullCalendar} fullCalendarCommon`}>
      <FullCalendar
        events={data}
        eventClick={(e) => openEvent(e)} 
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek",
        }}
        buttonText={{
          today: "Today",
          dayGridMonth: "Month",
          dayGridWeek: "Week",
        }}
         dateClick={handleDateClick} 
      />
    </div>
  );
};

export default CalendarComponent;
