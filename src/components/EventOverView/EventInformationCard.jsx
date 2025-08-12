import { Card } from "antd";
import { EditOutlined, CalendarOutlined } from "@ant-design/icons";

const EventInformationCard = () => {
  return (
    <Card
      className="rounded-xl border-none shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)]"
      bodyStyle={{ padding: "16px 20px" }}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-base font-semibold mb-3">Event Information</h3>

          <div className="flex flex-col sm:flex-row sm:gap-16 gap-4">
            <div className="w-full sm:w-2/4">
              <p className="text-[#6D6D6D] font-normal text-sm flex items-center gap-1">
                <CalendarOutlined />
                Venue Date
              </p>
              <p className="font-semibold text-sm">Thursday, 19 Jun 2025</p>
            </div>

            <div>
              <p className="text-[#6D6D6D] font-normal text-sm">
                Venue Location
              </p>
              <p className="font-semibold text-sm">Ahmedabad, Gujrat, India</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center gap-2 cursor-pointer">
          <EditOutlined className="text-[#A8805C] cursor-pointer ml-4" />
          <span className="text-[#A8805C]">Edit</span>
        </div>
      </div>
    </Card>
  );
};

export default EventInformationCard;
