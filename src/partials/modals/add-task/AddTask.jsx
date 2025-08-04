import { useEffect, useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import UserDropdown from "@/components/dropdowns/UserDropdown";
import TaskCategoryDropdown from "@/components/dropdowns/TaskCategoryDropdown";
import CheckboxButtonComponent from "@/components/form-components/CheckboxButtonComponent";
import AddProduct from "../add-product/AddProduct";
import { Checkbox, DatePicker } from "antd";

const AddTask = ({ isModalOpen, setIsModalOpen, editData }) => {
  const [formData, setFormData] = useState({});
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  const priorityOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ];

  const saveData = () => {
    // Save data logic here

    setIsModalOpen(false);
  };

  const handleChange = (value) => {
    setFormData({ ...formData, priority: value });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const [activeTab, setActiveTab] = useState("tab_1");

  useEffect(() => {
    if (isModalOpen) {
      setFormData({
        ...editData,
        product_data: [
          {
            productId: "",
            quantity: "",
          },
        ],
      });
    } else {
      setFormData(null);
    }
  }, [isModalOpen]);

  return (
    isModalOpen && (
      <>
        <CustomModal
          open={isModalOpen}
          onClose={handleModalClose}
          title="Add Task"
          width={560}
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
              <button
                key="save"
                className="btn btn-success"
                title="Save Task"
                onClick={saveData}
              >
                Save Task
              </button>
            </div>,
          ]}
        >
          <div id="tab_1" className="tab-content active">
            <div className="flex flex-col gap-y-2 gap-x-4">
              <div className="grid grid-cols-1">
                <div className="flex flex-col">
                  <label className="form-label">Task Title</label>
                  <div className="input">
                    <i className="ki-filled ki-autobrightness"></i>
                    <input
                      className="h-full"
                      type="text"
                      placeholder="Task title"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="form-label">Description</label>
                <textarea
                  className="textarea h-full"
                  placeholder="Description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                <div className="flex flex-col">
                  <label className="form-label">User</label>
                  <UserDropdown />
                </div>
                <div className="flex flex-col">
                  <label className="form-label">Category</label>
                  <TaskCategoryDropdown />
                </div>
              </div>
              <div className="grid grid-cols-1">
                <div className="flex flex-col">
                  <label className="form-label">
                    Select user to keep in loop
                  </label>
                  <select
                    className="select pe-7.5"
                    data-control="select2"
                    data-placeholder="user"
                  >
                    <option value="">Select user</option>
                  </select>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <label className="form-label">Priority</label>
                  <CheckboxButtonComponent
                    options={priorityOptions}
                    onChange={handleChange}
                    value={formData && formData.priority}
                  />
                </div>
                <div className="flex items-center ">
                  <div className="flex items-center gap-2">
                    <label className="form-label">Repeat</label>
                    <Checkbox />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DatePicker />
                </div>
              </div>
            </div>
          </div>
        </CustomModal>
        <AddProduct
          isModalOpen={isProductModalOpen}
          setIsModalOpen={setIsProductModalOpen}
        />
      </>
    )
  );
};
export default AddTask;
