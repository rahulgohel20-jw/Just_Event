import React, { Fragment, useState } from "react";
import { Container } from "@/components/container";
import CalendarComponent from "@/components/CalendarComponent";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import EventViewModal from "@/partials/modals/calendar-event/EventView";
import { useNavigate } from "react-router-dom";
import {calendarData} from "./constant";
const CalendarPage = () => {

   const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventModalData, setEventModalData] = useState(false)
  const openEvent = (data) => {
    setEventModalData(data)
    setIsModalOpen(true)
  }

  const handleDateClick =(info)=>{
    const clickedDate = new Date(info.dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (clickedDate > today) {
      navigate('/add-event', {
            state: {
              event_date: clickedDate,
            },
          });
    }
    
  }
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Events" }]} />
        </div>
        <CalendarComponent
          data={calendarData}
          openEvent={openEvent}
          handleDateClick={handleDateClick}
        />
      </Container>
      {/* AddContact */}
      {isModalOpen && (
      <EventViewModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} eventData={eventModalData} />
      )}
    </Fragment>
  );
};
export default CalendarPage;
