import React, { Fragment, useState } from "react";
import { Container } from "@/components/container";
import CalendarComponent from "@/components/CalendarComponent";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import EventViewModal from "@/partials/modals/calendar-event/EventView";
import { useNavigate } from "react-router-dom";
import { calendarData } from "./constant";
import AddEvent from "@/partials/modals/add-event/AddEvent";
const CalendarPage = () => {
  const navigate = useNavigate();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventModalData, setEventModalData] = useState(false);

  const statuses = [
    { label: "Confirm", color: "bg-[#1AFF00]" },
    { label: "Estimate", color: "bg-[#0011FF]" },
    { label: "High Priority", color: "bg-[#FFB700]" },
    { label: "Inquiry", color: "bg-[#00FFFF]" },
    { label: "Cancel", color: "bg-[#FF0000]" },
  ];
  const openEvent = (data) => {
    setEventModalData(data);
    setIsModalOpen(true);
  };

  // const handleDateClick = (info) => {
  //   const clickedDate = new Date(info.dateStr);
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);
  //   if (clickedDate > today) {
  //     navigate('/add-event', {
  //           state: {
  //             event_date: clickedDate,
  //           },
  //         });
  //   }
  // };

  const handleDateClick = (info) => {
    const clickedDate = new Date(info.dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (clickedDate >= today) {
      setEventData({ event_date: clickedDate });
      setIsEventModalOpen(true);
    }
  };
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Events" }]} />
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          {statuses.map((status, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className={`w-8 h-6 rounded-[8px] ${status.color}`} />
              <span className="text-sm text-[#6D6D6D]">{status.label}</span>
            </div>
          ))}
        </div>
        <CalendarComponent
          data={calendarData}
          openEvent={openEvent}
          handleDateClick={handleDateClick}
        />
      </Container>
      {/* AddContact */}
      {isModalOpen && (
        <EventViewModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          eventData={eventModalData}
        />
      )}

      {isEventModalOpen && (
        <AddEvent
          isModalOpen={isEventModalOpen}
          setIsModalOpen={setIsEventModalOpen}
          editData={eventData}
        />
      )}
    </Fragment>
  );
};
export default CalendarPage;
