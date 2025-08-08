import { useEffect, useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Select } from "antd";
import { toAbsoluteUrl } from "@/utils";
import { useNavigate } from "react-router-dom";

const AddEvent = ({ isModalOpen, setIsModalOpen, editData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const inquiryTypes = [
    { label: "Confirm", value: "confirm" },
    { label: "Inquiry", value: "inquiry" },
  ];

  const saveData = () => {
    console.log(formData);

    // Save logic
    if (formData.inquiryType === "confirm") {
      navigate("/add-event");
    } else {
      setIsModalOpen(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (isModalOpen) {
      setFormData({ ...editData });
    } else {
      setFormData({});
    }
  }, [isModalOpen]);

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="Add a new event"
        width={560}
        footer={[
          <div
            className="flex justify-center w-full px-4 pb-4 gap-2.5"
            key="footer-buttons"
          >
            <button
              className="bg-[#fff] px-4 py-2 rounded shadow-cancle"
              onClick={handleModalClose}
            >
              Cancel
            </button>
            <button
              className=" text-white bg-[#96644D] px-4 py-2 rounded"
              onClick={saveData}
            >
              Add Event
            </button>
          </div>,
        ]}
      >
        <div className="px-6 py-2 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold text-center leading-[42px]">
              Select Your Inquiry
            </h2>
            <p className="text-sm font-bold text-center text-gray-500">
              If You Need More Information, Please Select{" "}
              <span className="text-blue-500 font-bold cursor-pointer">
                Inquiry Type...
              </span>
            </p>
          </div>

          <div className="flex flex-col">
            <div className="flex flex-row items-end">
              <label className="form-label leading-[32px]">
                Select Inquiry Type
              </label>
              <img
                src={toAbsoluteUrl("/media/calendar/calendar-illustration.png")}
                alt="calendar illustration"
                className="w-24 h-24"
              />
            </div>
            <Select
              className="w-10/12"
              placeholder="Select type"
              options={inquiryTypes}
              value={formData?.inquiryType}
              onChange={(value) =>
                setFormData({ ...formData, inquiryType: value })
              }
            />
          </div>
        </div>
      </CustomModal>
    )
  );
};

export default AddEvent;
