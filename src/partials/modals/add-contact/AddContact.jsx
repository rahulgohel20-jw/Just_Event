import { useEffect, useState } from "react";
import PhoneNumber from "@/components/form-inputs/PhoneNumber/PhoneNumber";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import DatePicker from "@/components/form-inputs/DatePicker/DatePicker";
import Addcompany from "@/partials/modals/add-company/AddCompany";
import { Linkedin } from "lucide-react";

const AddContact = ({ isModalOpen, setIsModalOpen, editData }) => {
  const [iscompanyModalOpen, setIscompanyModalOpen] = useState(false);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [dateOfAnniversary, setDateOfAnniversary] = useState(null);
  const [formData, setFormData] = useState();

  const handInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenCompanyModal = () => {
    setIscompanyModalOpen(true);
  };

  const handleMultiInputChange = (data) => {
    setFormData({ ...formData, ...data });
  };

  const saveData = () => {
    // Save data logic here

    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const [activeTab, setActiveTab] = useState("tab_1");

  const renderTabContent = () => {
    switch (activeTab) {
      case "tab_1":
        return (
          <div id="tab_1" className="tab-content active">
            <div className="flex flex-col gap-y-2">
              <div className="grid grid-cols-2 gap-x-4">
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-3">
                    <label className="form-label w-fit">Company Name</label>
                    <span
                      className="text-blue-500 underline cursor-pointer"
                      onClick={handleOpenCompanyModal}
                    >
                      Add Compnay
                    </span>
                  </div>
                  <select
                    className="select pe-7.5"
                    data-control="select2"
                    data-placeholder="Company name"
                  >
                    <option value="admin">shree infotech</option>
                    <option value="user">shree </option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="form-label">Email</label>
                  <div className="input">
                    <i className="ki-filled ki-sms"></i>
                    <input
                      className="h-full"
                      type="text"
                      placeholder="Enter email"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4">
                <div className="flex flex-col">
                  <label className="form-label">First Name</label>
                  <div className="input">
                    <i className="ki-filled ki-user"></i>
                    <input
                      className="h-full"
                      type="text"
                      placeholder="Enter first name"
                      value={formData?.first_name}
                      name="first_name"
                      onChange={handInputChange}
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="form-label">Last Name</label>
                  <div className="input">
                    <i className="ki-filled ki-user"></i>
                    <input
                      className="h-full"
                      type="text"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
              </div>
              <PhoneNumber
                value={formData?.mobile}
                name="mobile"
                handleMultiInputChange={handleMultiInputChange}
              />
              <div className="grid grid-cols-2 gap-x-4">
                <div className="flex flex-col">
                  <label className="form-label">Date of Birth</label>
                  <DatePicker date={dateOfBirth} setDate={setDateOfBirth} />
                </div>
                <div className="flex flex-col">
                  <label className="form-label">Date of Anniversary</label>
                  <DatePicker
                    date={dateOfAnniversary}
                    setDate={setDateOfAnniversary}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case "tab_2":
        return (
          <div id="tab_2" className="tab-content mb-2">
            <div className="flex flex-col gap-y-2">
              <div className="grid grid-cols-2 gap-x-4">
                <div className="flex flex-col">
                  <label className="form-label">State</label>
                  <div className="input">
                    <i className="ki-filled ki-bank"></i>
                    <input type="text" placeholder="State" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="form-label">City</label>
                  <div className="input">
                    <i className="ki-filled ki-pointers"></i>
                    <input type="text" placeholder="City" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-4">
                <div className="flex flex-col">
                  <label className="form-label">Pincode</label>
                  <div className="input">
                    <i className="ki-filled ki-geolocation"></i>
                    <input type="text" placeholder="Pincode" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="form-label">Address</label>
                  <div className="input">
                    <i className="ki-filled ki-geolocation"></i>
                    <input type="text" placeholder="Address" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "tab_3":
        return (
          <div id="tab_3" className="tab-content mb-2">
            <div className="flex flex-col gap-y-2">
              <div className="flex flex-col">
                <label className="form-label">Linkedin</label>
                <div className="input">
                  <Linkedin className="size-4" />
                  <input
                    type="text"
                    placeholder="Enter valid URL starting with https://"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="form-label">Twitter</label>
                <div className="input">
                  <i className="ki-filled ki-twitter"></i>
                  <input
                    type="text"
                    placeholder="Enter valid URL starting with https://"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="form-label">Youtube</label>
                <div className="input">
                  <i className="ki-filled ki-youtube"></i>
                  <input
                    type="text"
                    placeholder="Enter valid URL starting with https://"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="form-label">Facebook</label>
                <div className="input">
                  <i className="ki-filled ki-facebook"></i>
                  <input
                    type="text"
                    placeholder="Enter valid URL starting with https://"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <label className="form-label">Instagram</label>
                <div className="input">
                  <i className="ki-filled ki-instagram"></i>
                  <input
                    type="text"
                    placeholder="Enter valid URL starting with https://"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "tab_4":
        return (
          <div id="tab_4" className="tab-content">
            <div className="flex flex-col gap-y-2 gap-x-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4">
                <div className="flex flex-col">
                  <label className="form-label">Text Field</label>
                  <div className="input">
                    <input
                      className="h-full"
                      type="text"
                      placeholder="Text Field"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="form-label">Number</label>
                  <div className="input">
                    <input
                      className="h-full"
                      type="number"
                      placeholder="Number"
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <label className="form-label">Drop Down</label>
                  <select
                    className="select pe-7.5"
                    data-control="select2"
                    data-placeholder="Drop Down"
                  >
                    <option value="">Drop Down</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      setFormData(editData);
    } else {
      setFormData(null);
    }
  }, [isModalOpen]);

  return (
    <>
      {isModalOpen && (
        <CustomModal
          open={isModalOpen}
          onClose={handleModalClose}
          title="Add Contact"
          width={640}
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
                title="Save"
                onClick={saveData}
              >
                Save
              </button>
            </div>,
          ]}
        >
          <div
            className="btn-tabs btn-tabs-lg flex justify-between mb-3 w-full"
            data-tabs="true"
          >
            <a
              className={`btn btn-clear w-full flex justify-center ${
                activeTab === "tab_1" ? "active" : ""
              }`}
              onClick={() => setActiveTab("tab_1")}
            >
              <i className="ki-filled ki-book-open"></i>
              Contact Details
            </a>
            <a
              className={`btn btn-clear w-full flex justify-center ${
                activeTab === "tab_2" ? "active" : ""
              }`}
              onClick={() => setActiveTab("tab_2")}
            >
              <i className="ki-filled ki-geolocation-home"></i>
              Address Details
            </a>
            <a
              className={`btn btn-clear w-full flex justify-center ${
                activeTab === "tab_3" ? "active" : ""
              }`}
              onClick={() => setActiveTab("tab_3")}
            >
              <i className="ki-filled ki-user-square"></i>
              Social Profile
            </a>
            <a
              className={`btn btn-clear w-full flex justify-center ${
                activeTab === "tab_4" ? "active" : ""
              }`}
              onClick={() => setActiveTab("tab_4")}
            >
              <i className="ki-filled ki-user-square"></i>
              Custom Fields
            </a>
          </div>
          {renderTabContent(formData)}
        </CustomModal>
      )}
      <Addcompany
        isModalOpen={iscompanyModalOpen}
        setIsModalOpen={setIscompanyModalOpen}
      />
    </>
  );
};
export default AddContact;
