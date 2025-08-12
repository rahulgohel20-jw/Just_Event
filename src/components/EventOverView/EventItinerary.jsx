import { useState } from "react";
import { Tabs } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { toAbsoluteUrl } from "@/utils";

const { TabPane } = Tabs;

const scheduleData = [
  {
    icon: toAbsoluteUrl("/media/event-overview/guest1.png"),
    title: "Guest Arrival & Welcome Drinks",
    time: "06:00 PM",
    duration: "Duration 60 Min",
  },
  {
    icon: toAbsoluteUrl("/media/event-overview/pencil.png"),
    title: "Mehendi Begins",
    time: "07:00 PM",
    duration: "Duration 90 Min",
  },
  {
    icon: toAbsoluteUrl("/media/event-overview/music.png"),
    title: "Music Dance & Celebrations",
    time: "08:30 PM",
    duration: "Duration 90 Min",
  },
  {
    icon: toAbsoluteUrl("/media/event-overview/dinner.png"),
    title: "Dinner Service",
    time: "10:00 PM",
    duration: "Duration 45 Min",
  },
  {
    icon: toAbsoluteUrl("/media/event-overview/guest1.png"),
    title: "Event Conclusion",
    time: "10:45 AM",
    duration: "Duration 15 Min",
  },
];

export default function EventItinerary() {
  const [activeKey, setActiveKey] = useState("1");

  const days = [
    { key: "1", label: "Day 1 : July 25, 2025" },
    { key: "2", label: "Day 2 : July 26, 2025" },
    { key: "3", label: "Day 3 : July 27, 2025" },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)]">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-black font-bold">Event Itinerary</h2>
          <p className="text-[#6D6D6D] text-sm">
            Manage and view the schedule for your event.
          </p>
        </div>
        <button className="flex items-center text-sm text-[#A16207] hover:underline">
          <EditOutlined className="mr-1" /> Edit
        </button>
      </div>

      <div className="border-b border-[#F5F0E6] justify-between mt-8 flex gap-6">
        {days.map((day) => (
          <button
            key={day.key}
            onClick={() => setActiveKey(day.key)}
            className={`pb-1 border-b-2 transition-all ${
              activeKey === day.key
                ? "border-[#C69A6E] font-bold text-black"
                : "border-transparent text-gray-500"
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {activeKey === "1" && (
          <>
            <p className="font-bold text-black">
              Function : <span className="font-bold text-black">Mehendi</span>
            </p>
            <p className="font-bold text-black">
              Venue :
              <span className="font-bold text-black">Grand Ballroom</span>
            </p>

            <div className="mt-6 flex flex-col gap-8 relative">
              <div className="absolute left-[10px] top-0 bottom-0 w-[2px] bg-[#FDE7C7]" />
              {scheduleData.map((item, index) => (
                <div key={index} className="flex items-start gap-4 relative">
                  <div className="bg-white z-10">
                    <img
                      src={item.icon}
                      alt={item.title}
                      className="w-6 h-6 object-contain"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-[#000000CC]">
                      {item.title}
                    </p>
                    <p className="text-sm font-semibold">
                      {item.time}
                      <span className="ml-2 text-[9px] font-normal">
                        {item.duration}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeKey === "2" && (
          <p className="text-gray-500">No events scheduled.</p>
        )}
        {activeKey === "3" && (
          <p className="text-gray-500">No events scheduled.</p>
        )}
      </div>
    </div>
  );
}
