import { useState } from "react";
import PropTypes from "prop-types";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Checkbox } from "@mui/material";
import { createRole } from "@/services/apiServices";
import { updateRole } from "@/services/apiServices";

const permissions = [
  "Dashboard",
  "Pipeline",
  "Contacts",
  "Company",
  "Follow-up",
  "Products",
  "Team",
  "Settings",
];

const AddRole = ({
  isModalOpen,
  setIsModalOpen,
  editData,
  successFunction,
}) => {
  const [formData, setFormData] = useState(editData || {});
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAddRole = () => {
    let data = {
      role_name: formData.role_name,
      created_at: "2025-07-01T01:25:39.250Z",
      updated_at: "2025-07-01T12:49:12.877Z",
    };
    if (formData.role_id) {
      updateRole(formData.role_id, data)
        .then((response) => {
          successFunction();
        })
        .catch((error) => {
          console.error("Error fetching roles:", error);
        })
        .finally(() => {});
    } else {
      createRole(data)
        .then((response) => {
          successFunction();
        })
        .catch((error) => {
          console.error("Error fetching roles:", error);
        })
        .finally(() => {});
    }
  };
  const [activeTab, setActiveTab] = useState("pages");
  //   const [selectedFeature, setSelectedFeature] = useState("basic");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="Add Role"
        width={650}
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
              onClick={handleAddRole}
            >
              Save
            </button>
          </div>,
        ]}
      >
        <div className="flex flex-col gap-y-2 max-h-[500px] overflow-auto scrollable-y">
          <div className="flex flex-col">
            <label className="form-label">Define Role</label>
            <div className="input">
              <i className="ki-filled ki-user"></i>
              <input
                type="text"
                className="h-full"
                placeholder="Define Role"
                name="role_name"
                value={formData.role_name || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label className="form-label">Lead Access</label>
            <select
              className="select pe-7.5"
              name="lead_access"
              value={formData.lead_access || "all"}
              onChange={handleInputChange}
            >
              <option value="all">All Leads</option>
              <option value="assigned">Assigned Leads</option>
              <option value="created">Leads</option>
            </select>
          </div>
          <div className="flex flex-col border mt-2">
            <div className="flex border-b pt-3 mb-3 bg-gray-200">
              <button
                onClick={() => setActiveTab("pages")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "pages"
                    ? "border-b-2 border-primary text-primary font-bold"
                    : "text-gray-700 border-b-2 border-gray-200"
                }`}
              >
                <i className="ki-filled ki-notepad-bookmark me-2"></i>
                Pages
              </button>
              <button
                onClick={() => setActiveTab("features")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "features"
                    ? "border-b-2 border-primary text-primary font-bold"
                    : "text-gray-700 border-b-2 border-gray-200"
                }`}
              >
                <i className="ki-filled ki-text-circle me-2"></i>
                Features
              </button>
            </div>
            {activeTab === "pages" && (
              <div className="max-h-90 relative w-full scrollable-x-auto rounded-md">
                <table className="w-full align-middle text-left rtl:text-right caption-bottom text-sm">
                  <thead>
                    <tr className="border-b border-t bg-muted/30 data-[state=selected]:bg-muted [&_>:last-child]:border-e-0">
                      <th className="p-2 border-e h-12 text-left rtl:text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pe-0">
                        Pages
                      </th>
                      <th className="p-2 border-e h-12 text-left rtl:text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pe-0 text-center">
                        View
                      </th>
                      <th className="p-2 border-e h-12 text-left rtl:text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pe-0 text-center">
                        Edit
                      </th>
                      <th className="p-2 border-e h-12 text-left rtl:text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pe-0 text-center">
                        Delete
                      </th>
                      <th className="p-2 border-e h-12 text-left rtl:text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pe-0 text-center">
                        Add
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((page) => (
                      <tr key={page} className="border-t">
                        <td className="p-2">{page}</td>
                        {["view", "edit", "delete", "add"].map((action) => (
                          <td key={action} className="p-2 text-center">
                            <Checkbox />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Features Table */}
            {activeTab === "features" && (
              <div className="max-h-90 relative w-full scrollable-x-auto rounded-md">
                <table className="w-full align-middle text-left rtl:text-right caption-bottom text-sm">
                  <thead>
                    <tr className="border-b border-t bg-muted/30 data-[state=selected]:bg-muted [&_>:last-child]:border-e-0">
                      <th className="p-2 border-e h-12 text-left rtl:text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pe-0">
                        Features
                      </th>
                      <th className="p-2 border-e h-12 text-left rtl:text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pe-0 text-center">
                        Enable / Disable
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      "Send Whatsapp",
                      "Bulk Upload",
                      "Pipeline Template",
                      "Send Quotation To Client",
                      "All Quotation Page Access",
                      "Quotation Setting Page Access",
                    ].map((feature) => (
                      <tr key={feature} className="border-t">
                        <td className="p-2">{feature}</td>
                        <td className="p-2 text-center">
                          <Checkbox />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </CustomModal>
    )
  );
};
AddRole.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
};

export default AddRole;
