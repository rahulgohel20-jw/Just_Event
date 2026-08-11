import { X, Clock, Pencil, Calendar } from "lucide-react";
import { CustomModal } from "@/components/custom-modal/CustomModal"; // adjust path as needed

const ViewFunctionModal = ({ open, onClose, functionData, onEdit }) => {
  if (!functionData) return null;

  const {
    functionName,
    functionNameHindi,
    functionNameGujarati,
    timeFrom,
    timeTo,
    images = [],
    createdAt,
  } = functionData;

  const coverImage = images[0]?.path;

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      width={520}
      centered
      title={null}
      footer={
        <div className="flex justify-end items-center px-6 pb-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#F7E5EA] text-[#7A2E45] font-medium hover:bg-[#f0d3dc] transition-colors"
          >
            Close
          </button>
         
        </div>
      }
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-start px-6 pt-4 pb-3">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">{functionName}</h2>
           
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={18} />
          </button>
        </div>

        {/* Cover image */}
        {coverImage && (
          <div className="px-6">
            <img
              src={coverImage}
              alt={functionName}
              className="w-full h-56 rounded-xl object-cover"
            />
          </div>
        )}

        {/* All images gallery */}
        {images.length > 1 && (
          <div className="px-6 mt-3">
            <p className="text-xs text-gray-400 mb-2">
              All images ({images.length})
            </p>
            <div className="grid grid-cols-4 gap-2">
              {images.map((img) => (
                <img
                  key={img.id}
                  src={img.path}
                  alt=""
                  className="h-16 w-full rounded-lg object-cover border border-gray-200"
                />
              ))}
            </div>
          </div>
        )}

        {/* Details */}
        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Function name</p>
            <p className="text-sm font-medium text-gray-800">{functionName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Time slot</p>
            <p className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
              <Clock size={12} className="text-gray-900" />
              {timeFrom} - {timeTo}
            </p>
          </div>
          {functionNameHindi && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Name (Hindi)</p>
              <p className="text-sm font-medium text-gray-800">{functionNameHindi}</p>
            </div>
          )}
          {functionNameGujarati && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Name (Gujarati)</p>
              <p className="text-sm font-medium text-gray-800">{functionNameGujarati}</p>
            </div>
          )}
          {createdAt && (
            <div>
              <p className="text-xs text-gray-600 mb-1">Created</p>
              <p className="flex items-center gap-1.5 text-sm font-medium text-gray-800">
                <Calendar size={12} className="text-gray-900" />
                {createdAt}
              </p>
            </div>
          )}
        </div>
      </div>
    </CustomModal>
  );
};

export { ViewFunctionModal };