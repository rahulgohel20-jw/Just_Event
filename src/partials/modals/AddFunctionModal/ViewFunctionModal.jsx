import { X, Clock, IndianRupee, Pencil } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal"; // adjust path as needed

const typeBadgeStyles = {
  Bride: "bg-rose-50 text-rose-700",
  Groom: "bg-blue-50 text-blue-700",
  Corporate: "bg-purple-50 text-purple-700",
};

const ViewFunctionModal = ({ open, onClose, functionData, onEdit }) => {
  if (!functionData) return null;

  const { functionName, type, status, timeFrom, timeTo, price, coverImage } =
    functionData;
  const isActive = status === "active";

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      width={480}
      centered
      title={null}
      footer={
        <div className="flex justify-between items-center px-6 pb-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#F7E5EA] text-[#7A2E45] font-medium hover:bg-[#f0d3dc] transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => onEdit?.(functionData)}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#7A2E45] text-white font-medium hover:bg-[#66253a] transition-colors"
          >
            <Pencil size={16} />
            Edit Function
          </button>
        </div>
      }
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-start px-6 pt-4 pb-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{functionName}</h2>
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  typeBadgeStyles[type] || "bg-gray-100 text-gray-700"
                }`}
              >
                {type}
              </span>
              <span
                className={`flex items-center gap-1 text-xs font-medium ${
                  isActive ? "text-emerald-600" : "text-gray-400"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isActive ? "bg-emerald-500" : "bg-gray-300"
                  }`}
                />
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        {/* Cover image */}
        <div className="px-6">
          <img
            src={coverImage}
            alt={functionName}
            className="w-full h-56 rounded-xl object-cover"
          />
        </div>

        {/* Details */}
        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Function Name</p>
            <p className="text-sm font-medium text-gray-800">{functionName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Type</p>
            <p className="text-sm font-medium text-gray-800">{type}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Time Slot</p>
            <p className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
              <Clock size={12} className="text-gray-400" />
              {timeFrom} - {timeTo}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Price</p>
            <p className="flex items-center gap-1 text-sm font-semibold text-[#7A2E45]">
              <IndianRupee size={13} />
              {Number(price).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export { ViewFunctionModal };