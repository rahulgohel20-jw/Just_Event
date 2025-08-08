import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch"; // or any toggle component you use
import BrideAndGroom from "./BrideAndGroom";
const ClientDetailsStep = ({
  formData,
  setFormData,
  onInputChange,
  handleInputChange,
}) => {
  const [isBrideGroom, setIsBrideGroom] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center space-x-2">
        <label className="text-sm font-normal text-black">
          Add Bride & Groom
        </label>
        <Switch
          checked={isBrideGroom}
          onCheckedChange={setIsBrideGroom}
          className="data-[state=checked]:bg-[#97654D]"
        />
      </div>

      {isBrideGroom ? (
        <BrideAndGroom
          formData={formData}
          setFormData={setFormData}
          handleInputChange={handleInputChange}
        />
      ) : (
        <>
          <div>
            <label className="text-sm font-normal text-black mb-1 block">
              1. Client's Name
            </label>
            <div className="flex space-x-2">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none"
                value={formData.title}
                onChange={(e) => onInputChange(e, "title")}
              >
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
              </select>
              <Input
                placeholder="Alex Roy"
                value={formData.name}
                onChange={(e) => onInputChange(e, "name")}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-normal text-black mb-1 block">
              Address
            </label>
            <Textarea
              placeholder="Enter Order Address"
              rows={2}
              value={formData.address}
              onChange={(e) => onInputChange(e, "address")}
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-x-32">
            <div className=" w-1/2">
              <label className="text-sm font-normal text-black mb-1 block">
                Mobile Number
              </label>
              <Input
                placeholder="Enter Mobile Number"
                value={formData.mobile}
                onChange={(e) => onInputChange(e, "mobile")}
              />
            </div>

            <div className="flex items-center gap-10 mt-2 md:mt-6">
              <span className="text-sm font-normal text-black">
                High Priority:
              </span>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="highPriority"
                  checked={formData.highPriority === true}
                  onChange={() =>
                    setFormData({ ...formData, highPriority: true })
                  }
                />
                Yes
              </label>
              <label className="flex items-center gap-1 text-sm">
                <input
                  type="radio"
                  name="highPriority"
                  checked={formData.highPriority === false}
                  onChange={() =>
                    setFormData({ ...formData, highPriority: false })
                  }
                />
                No
              </label>
            </div>
          </div>

          <div>
            <label className="text-sm font-normal text-black mb-1 block">
              Lead Source :
            </label>
            <Input
              placeholder=""
              value={formData.leadSource}
              onChange={(e) => onInputChange(e, "leadSource")}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ClientDetailsStep;
