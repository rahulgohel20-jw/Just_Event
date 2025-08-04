import { useState } from "react";

import { CustomModal } from "@/components/custom-modal/CustomModal";
import FileUploadComponent from "@/components/form-components/FileUploadComponent";

const AddLink = ({ isModalOpen, setIsModalOpen }) => {
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const [activeTab, setActiveTab] = useState("tab_1");

  const renderTabContent = () => {
    switch (activeTab) {
      case "tab_1":
        return <div id="tab_1" className="tab-content active"></div>;

      default:
        return null;
    }
  };

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="Add Link"
        width={500}
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
          <div className="flex flex-col">
            <select className="select pe-7.5">
              <option value="0">Please select</option>
              <option value="1">Sales</option>
              <option value="2">Marketing</option>
              <option value="3">Customer Support</option>
              <option value="4">HR/Admin</option>
              <option value="5">General</option>
              <option value="6">Automation</option>
              <option value="7">Operations</option>
            </select>
          </div>
          <div className="flex flex-col">
            <div className="input">
              <input className="h-full" type="text" placeholder="Link Name" />
            </div>
          </div>
          <div className="flex flex-col">
            <textarea
              rows={4}
              type="text"
              className="textarea h-full"
              placeholder="Description here"
            />
          </div>
          <div className="flex flex-col">
            <FileUploadComponent type="file" />
          </div>
        </div>
        {renderTabContent()}
      </CustomModal>
    )
  );
};
export default AddLink;
