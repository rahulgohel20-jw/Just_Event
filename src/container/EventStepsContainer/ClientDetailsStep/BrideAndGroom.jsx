import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toAbsoluteUrl } from "@/utils";

function BrideAndGroom({ formData, setFormData, handleInputChange }) {
  const namePrefixes = ["Mr.", "Mrs."];

  const IconWrapper = ({ icon }) => (
    <i className={`ki-filled ${icon} text-[#97654D] text-lg`} />
  );

  return (
    <div className="p-6 space-y-8 text-sm text-gray-800">
      {/* Client 1 */}
      <div>
        <label className="block mb-1 font-normal text-black">
          1. Client's Name
        </label>
        <div className="flex gap-2 items-center">
          <select
            className="border border-gray-300 rounded-xl px-3 py-2 shadow-sm focus:outline-none"
            value={formData.client1Title}
            onChange={(e) => handleInputChange(e, "client1Title")}
          >
            {namePrefixes.map((prefix) => (
              <option key={prefix}>{prefix}</option>
            ))}
          </select>
          <div className="flex items-center gap-2 border rounded-xl px-2 w-5/12">
            <IconWrapper icon="ki-user" />
            <Input
              type="text"
              placeholder="Alex Roy"
              className="border-0 focus:ring-0"
              value={formData.client1Name}
              onChange={(e) => handleInputChange(e, "client1Name")}
            />
          </div>
          <div className="ml-4 flex items-center gap-2 w-2/5 min-w-[160px]">
            <Button
              onClick={() => setFormData({ ...formData, client1Type: "groom" })}
              className={`flex items-center gap-2 px-4 py-1 rounded-xl w-1/3 ${
                formData.client1Type === "groom"
                  ? "bg-[#96644D] text-white"
                  : "bg-white text-black border"
              }`}
            >
              <img
                src={toAbsoluteUrl("/media/bride-groom/groom.png")}
                alt="Groom"
                className="w-8 h-8"
              />
              Groom
            </Button>
            <Button
              onClick={() => setFormData({ ...formData, client1Type: "bride" })}
              className={`flex items-center gap-2 px-4 py-1 rounded-xl w-1/3 ${
                formData.client1Type === "bride"
                  ? "bg-[#96644D] text-white"
                  : "bg-white text-black border"
              }`}
            >
              <img
                src={toAbsoluteUrl("/media/bride-groom/bride.png")}
                alt="bride"
                className="w-8 h-8"
              />
              Bride
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 border rounded-xl px-2">
          <IconWrapper icon="ki-geolocation" />
          <Textarea
            placeholder="Enter Order Address"
            className="border-0 focus:ring-0 resize-none"
            rows={2}
            value={formData.client1Address}
            onChange={(e) => handleInputChange(e, "client1Address")}
          />
        </div>
        <div className="flex items-center gap-2 mt-3 border rounded-xl px-2 w-1/2">
          <IconWrapper icon="ki-phone" />
          <Input
            type="text"
            placeholder="Enter Mobile Number"
            className="border-0 focus:ring-0"
            value={formData.client1Mobile}
            onChange={(e) => handleInputChange(e, "client1Mobile")}
          />
        </div>
      </div>

      {/* Client 2 */}
      <div>
        <label className="block mb-1 font-normal text-black">
          2. Client's Name
        </label>
        <div className="flex gap-2 items-center">
          <select
            className="border border-gray-300 rounded-xl px-3 py-2 shadow-sm focus:outline-none"
            value={formData.client2Title}
            onChange={(e) => handleInputChange(e, "client2Title")}
          >
            {namePrefixes.map((prefix) => (
              <option key={prefix}>{prefix}</option>
            ))}
          </select>
          <div className="flex items-center gap-2 border rounded-xl px-2 w-5/12">
            <IconWrapper icon="ki-user" />
            <Input
              type="text"
              placeholder="Veronica Mathew"
              className="border-0 focus:ring-0"
              value={formData.client2Name}
              onChange={(e) => handleInputChange(e, "client2Name")}
            />
          </div>
          <div className="ml-4 flex items-center gap-2 w-2/5 min-w-[160px]">
            <Button
              onClick={() => setFormData({ ...formData, client2Type: "groom" })}
              className={`flex items-center gap-2 px-4 py-1 rounded-xl w-1/3 ${
                formData.client2Type === "groom"
                  ? "bg-[#96644D] text-white"
                  : "bg-white text-black border"
              }`}
            >
              <img
                src={toAbsoluteUrl("/media/bride-groom/groom.png")}
                alt="Groom"
                className="w-8 h-8"
              />
              Groom
            </Button>
            <Button
              onClick={() => setFormData({ ...formData, client2Type: "bride" })}
              className={`flex items-center gap-2 px-4 py-1 rounded-xl w-1/3 ${
                formData.client2Type === "bride"
                  ? "bg-[#96644D] text-white"
                  : "bg-white text-black border"
              }`}
            >
              <img
                src={toAbsoluteUrl("/media/bride-groom/bride.png")}
                alt="bride"
                className="w-8 h-8"
              />
              Bride
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 border rounded-xl px-2">
          <IconWrapper icon="ki-geolocation" />
          <Textarea
            placeholder="Enter Order Address"
            className="border-0 focus:ring-0 resize-none"
            rows={2}
            value={formData.client2Address}
            onChange={(e) => handleInputChange(e, "client2Address")}
          />
        </div>
        <div className="flex items-center gap-2 mt-3 border rounded-xl px-2 w-1/2">
          <IconWrapper icon="ki-phone" />
          <Input
            type="text"
            placeholder="Enter Mobile Number"
            className="border-0 focus:ring-0"
            value={formData.client2Mobile}
            onChange={(e) => handleInputChange(e, "client2Mobile")}
          />
        </div>
      </div>

      {/* Lead Source + Priority */}
      <div className="flex flex-row gap-4 items-center">
        <div className="w-8/12 flex items-center gap-2 border rounded-xl px-2">
          <IconWrapper icon="ki-instagram" />
          <Input
            type="text"
            placeholder="Lead Source"
            className="border-0 focus:ring-0 w-full"
            value={formData.leadSource}
            onChange={(e) => handleInputChange(e, "leadSource")}
          />
        </div>

        <div className="flex items-center gap-4">
          <span className="font-normal text-black flex items-center gap-1">
            <IconWrapper icon="ki-flag" /> High Priority :
          </span>
          <label className="flex items-center gap-1">
            <Input
              type="radio"
              name="priority"
              checked={formData.highPriority === true}
              onChange={() => setFormData({ ...formData, highPriority: true })}
            />
            Yes
          </label>
          <label className="flex items-center gap-1">
            <Input
              type="radio"
              name="priority"
              checked={formData.highPriority === false}
              onChange={() => setFormData({ ...formData, highPriority: false })}
            />
            No
          </label>
        </div>
      </div>
    </div>
  );
}

export default BrideAndGroom;
