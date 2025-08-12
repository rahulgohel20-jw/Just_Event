import { Card } from "antd";
import { toAbsoluteUrl } from "@/utils";
const BrideGroomCard = () => {
  return (
    <Card className="rounded-xl  shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)] border-none p-5 h-64">
      <div className="flex justify-between items-start">
        <span className="text-gray-500 font-medium">Set Groom’s Name</span>

        <img
          src={toAbsoluteUrl("/media/event-overview/BrideGroom.png")}
          alt="Bride and Groom"
          className="absolute left-1/2 -translate-x-1/2 w-40 h-52 sm:w-48 sm:h-48 object-contain"
        />

        <span className="text-gray-500 font-medium">Set Bride’s Name</span>
      </div>
    </Card>
  );
};

export default BrideGroomCard;
