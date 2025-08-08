import { DatePicker } from "antd";
import { useState } from "react";

const OtherInfoStep = ({ formData, handleInputChange }) => {
  const [personType, setPersonType] = useState("groom_bride");

  const handleRadioChange = (e) => {
    setPersonType(e.target.value);
  };

  const renderInput = (label, name, value) => (
    <div className="flex flex-col">
      <label className="text-sm font-normal text-black mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        className="border rounded-md p-2"
      />
    </div>
  );

  const renderDateInput = (label, name, value) => (
    <div className="flex flex-col">
      <label className="text-sm mb-1">{label}</label>
      <DatePicker
        className="w-full border rounded-md p-2"
        placeholder="mm/dd/yyyy"
        value={value}
        onChange={(date) =>
          handleInputChange({ target: { value: date, name } })
        }
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex gap-6">
        <label className="flex items-center font-normal text-black gap-2 text-sm">
          <input
            type="radio"
            name="personType"
            value="groom_bride"
            checked={personType === "groom_bride"}
            className="accent-[#97654D]"
            onChange={handleRadioChange}
          />
          Groom/Bride
        </label>
        <label className="flex items-center font-normal text-black gap-2 text-sm">
          <input
            type="radio"
            name="personType"
            value="other"
            checked={personType === "other"}
            className="accent-[#97654D]"
            onChange={handleRadioChange}
          />
          Other/Reference
        </label>
      </div>

      {personType === "groom_bride" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-bold mb-4 text-[#393939] border-b pb-1">
              Groom’s Details
            </h2>
            <div className="space-y-4">
              {renderInput(
                "Groom’s Name",
                "groom_name",
                formData.groom_name,
                "Groom’s Name"
              )}
              {renderInput(
                "Groom’s Family Name",
                "groom_family_name",
                formData.groom_family_name,
                "Groom’s Family Name"
              )}
              {renderInput(
                "Groom’s Mob. No.",
                "groom_mobile",
                formData.groom_mobile,
                "Groom’s Mob. No."
              )}
              {renderInput(
                "Groom’s Insta Id",
                "groom_instagram",
                formData.groom_instagram,
                "Groom’s Insta Id"
              )}
              {renderDateInput(
                "Groom’s Birth Date",
                "groom_birth_date",
                formData.groom_birth_date
              )}
            </div>
          </div>

          <div>
            <h2 className="font-bold mb-4 text-[#393939] border-b pb-1">
              Bride’s Details
            </h2>
            <div className="space-y-4">
              {renderInput(
                "Bride’s Name",
                "bride_name",
                formData.bride_name,
                "Bride’s Name"
              )}
              {renderInput(
                "Bride’s Family Name",
                "bride_family_name",
                formData.bride_family_name,
                "Bride’s Family Name"
              )}
              {renderInput(
                "Bride’s Mob. No.",
                "bride_mobile",
                formData.bride_mobile,
                "Bride’s Mob. No."
              )}
              {renderInput(
                "Bride’s Insta Id",
                "bride_instagram",
                formData.bride_instagram,
                "Bride’s Insta Id"
              )}
              {renderDateInput(
                "Bride’s Birth Date",
                "bride_birth_date",
                formData.bride_birth_date
              )}
            </div>
          </div>
        </div>
      )}

      {personType === "other" && (
        <div className="space-y-6">
          <div className="w-full">
            <h2 className="font-semibold text-[#393939] mb-4 border-b pb-1">
              Photographer’s Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput(
                "Photographer’s Name",
                "Photographer_name",
                formData.Photographer_name
              )}
              {renderInput(
                "Photographer’s No.",
                "Photographer_mobile",
                formData.Photographer_mobile
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OtherInfoStep;
