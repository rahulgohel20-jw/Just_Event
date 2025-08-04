import { useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
const AddMember = ({ isModalOpen, setIsModalOpen }) => {
  const [taskAccess, setTaskAccess] = useState(true);
  const [leaveAccess, setLeaveAccess] = useState(true);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const [activeTab, setActiveTab] = useState("tab_1");

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="Add New Team Member"
        footer={[
          <div className="flex justify-between" key={"footer-buttons"}>
            <button
              key="cancel"
              className="btn btn-light"
              onClick={handleModalClose}
              title="Cancel"
            >
              Cancel
            </button>
            <button key="save" className="btn btn-success" title="Save">
              Save
            </button>
          </div>,
        ]}
      >
        <div className="flex flex-col gap-y-2">
          <div className="grid grid-cols-2 gap-x-4">
            <div className="flex flex-col">
              <label className="form-label">First Name</label>
              <div className="input">
                <i className="ki-filled ki-user"></i>
                <input
                  type="text"
                  className="h-full"
                  placeholder="First name"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="form-label">Last Name</label>
              <div className="input">
                <i className="ki-filled ki-user"></i>
                <input type="text" className="h-full" placeholder="Last name" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="flex flex-col">
              <label className="form-label">Country</label>
              <div className="input">
                <i className="ki-filled ki-flag"></i>
                <input type="text" className="h-full" placeholder="Country" />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="form-label">WhatsApp No</label>
              <div className="input">
                <i className="ki-filled ki-whatsapp"></i>
                <input
                  type="text"
                  className="h-full"
                  placeholder="WhatsApp no"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <label className="form-label">Role</label>
            <select className="select pe-7.5">
              <option value="0">Select Team Member</option>
              <option value="Team Member">Team Member</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <div className="flex flex-col">
              <label className="form-label">Email Address</label>
              <div className="input">
                <i className="ki-filled ki-sms"></i>
                <input
                  type="email"
                  className="h-full"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="form-label">Password</label>
              <div className="input">
                <i className="ki-filled ki-lock"></i>
                <input
                  type="password"
                  className="h-full"
                  placeholder="Password no"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <label className="form-label">Task Access</label>
            <label className="switch switch-lg">
              <input
                type="checkbox"
                value="1"
                name="check"
                defaultChecked
                readOnly
                checked={taskAccess}
                onChange={() => setTaskAccess(!taskAccess)}
              />
            </label>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <label className="form-label">Leave & Attendance Access</label>
            <label className="switch switch-lg">
              <input
                type="checkbox"
                value="1"
                name="check"
                defaultChecked
                readOnly
                checked={leaveAccess}
                onChange={() => setLeaveAccess(!leaveAccess)}
              />
            </label>
          </div>
        </div>

        {/* 
        <label className="text-black">LTask Access</label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={taskAccess}
            onChange={() => setTaskAccess(!taskAccess)}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-rose-500 transition duration-300"></div>
          <div
            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
              taskAccess ? "translate-x-5" : ""
            }`}
          ></div>
        </label>

        <label className="text-black">Leave & Attendance Access</label>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={leaveAccess}
            onChange={() => setLeaveAccess(!leaveAccess)}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-rose-500 transition duration-300"></div>
          <div
            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
              leaveAccess ? "translate-x-5" : ""
            }`}
          ></div>
        </label> */}
      </CustomModal>
    )
  );
};
export default AddMember;
