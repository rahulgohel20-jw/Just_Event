import { EditOutlined, CheckCircleFilled } from "@ant-design/icons";
import { Card } from "antd";
import { toAbsoluteUrl } from "@/utils";

const steps = [
  {
    title: "Event Information",
    icon: toAbsoluteUrl("/media/event-overview/eventinfo.png"),
    completed: true,
  },
  {
    title: "Estimation",
    icon: toAbsoluteUrl("/media/event-overview/est.png"),
    completed: false,
  },
  {
    title: "Execution",
    icon: toAbsoluteUrl("/media/event-overview/exe.png"),
    completed: false,
  },
  {
    title: "Vendor List",
    icon: toAbsoluteUrl("/media/event-overview/vendor.png"),
    completed: false,
  },
  {
    title: "Guest Outreach",
    icon: toAbsoluteUrl("/media/event-overview/guest.png"),
    completed: false,
  },
  {
    title: "Invoice Summary",
    icon: toAbsoluteUrl("/media/event-overview/invoice.png"),
    completed: false,
  },
];

export default function ChecklistProgress() {
  return (
    <Card className="shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)] rounded-2xl ">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-black">Checklist</h3>
          <p className="text-sm text-[#6D6D6D">Progress</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1 text-sm text-[#A8805C] cursor-pointer">
            <EditOutlined className="text-[#A8805C] cursor-pointer" />
            <span>Edit</span>
          </div>
          <span className="text-sm text-black font-medium">0%</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 mb-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center w-full">
            <div
              className={`flex flex-col items-center justify-center px-6 py-4 rounded-xl border shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)] bg-white transition-all w-[140px] h-[170px]`}
            >
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                  step.completed ? "bg-[#FDE7C7]" : "bg-[#F8F8F8]"
                }`}
              >
                <img
                  src={step.icon}
                  alt={step.title}
                  className="w-8 h-8 object-contain"
                />
              </div>

              <span className="text-sm font-medium text-center text-gray-800">
                {step.title}
              </span>
              <div className="mt-3">
                {step.completed ? (
                  <CheckCircleFilled className="text-green-500 text-lg" />
                ) : (
                  <div className="w-4 h-4 border border-gray-300 rounded-full" />
                )}
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 border-t-[2px] border-dotted border-[#0FB709] "></div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-around text-center pt-4">
        <div>
          <p className="text-sm text-[#6D6D6D] font-normal">Total Tasks</p>
          <p className="text-lg font-semibold text-black">100</p>
        </div>
        <div>
          <p className="text-sm text-[#6D6D6D] font-normal">Completed</p>
          <p className="text-lg font-semibold text-green-500">0</p>
        </div>
        <div>
          <p className="text-sm text-[#6D6D6D] font-normal">Still on the way</p>
          <p className="text-lg font-semibold text-[#A57353]">100</p>
        </div>
      </div>
    </Card>
  );
}
