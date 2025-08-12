import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { toAbsoluteUrl } from "@/utils";
import { Input, Select, Radio, Switch, Button, Divider, Checkbox } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { PlusOutlined } from "@ant-design/icons";

import HotelAccommodationForm from "@/pages/Guest/HotelAccommodation/HotelAccommodationForm";
import TransportationForm from "@/pages/Guest/TransportationForm/TransportationForm";
const { Option } = Select;

function GuestForm() {
  const [showHotel, setShowHotel] = useState(false);
  const [showTransport, setShowTransport] = useState(false);

  const [subGuests, setSubGuests] = useState([]);

  const [formData, setFormData] = useState({
    specialrequests: "", // always initialize
    // other fields...
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const removeGuest = (id) => {
    setSubGuests((prev) => prev.filter((guest) => guest.id !== id));
  };

  const handleAddSubGuest = () => {
    setSubGuests([...subGuests, { id: Date.now() }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = Object.fromEntries(formData.entries());

    const guests = subGuests.map((_, index) => ({
      fullName: formData.get(`subGuests[${index}][fullName]`),
      email: formData.get(`subGuests[${index}][email]`),
      mobile: formData.get(`subGuests[${index}][mobile]`),
      attending: formData.get(`subGuests[${index}][attending]`) === "on",
    }));

    console.log({
      ...data,
      subGuests: guests,
    });
  };

  return (
    <Fragment>
      <Container>
        <div className="flex justify-between items-center mb-4">
          <Breadcrumbs
            items={[
              {
                title: "Guest Form",
                subTitle: "Please fill out the form to confirm attendance.",
              },
            ]}
          />
          <Button
            htmlType="submit"
            form="guestForm"
            className="bg-[#FDE7C7] rounded-lg text-[#845A12] font-semibold 
                       hover:!bg-[#FDE7C7] hover:!text-[#845A12] hover:!border-none 
                       shadow-addGuest flex items-center gap-2"
          >
            <img
              src={toAbsoluteUrl("/media/guest/save.png")}
              className="w-5 h-5"
              alt="save"
            />
            Save
          </Button>
        </div>

        <form id="guestForm" onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Radio.Group name="personType" defaultValue="groom">
              <Radio value="groom">Groom</Radio>
              <Radio value="bride">Bride</Radio>
            </Radio.Group>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-black">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                className="textarea"
                name="fullName"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="text-black">
                Email ID <span className="text-red-500">*</span>
              </label>
              <Input
                className="textarea"
                name="email"
                type="email"
                placeholder="Enter your email address"
                required
              />
            </div>
            <div>
              <label className="text-black">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <Input
                className="textarea"
                name="mobile"
                placeholder="Enter your mobile number"
                required
              />
            </div>
            <div>
              <label className="text-black">
                Which event will they be attending?{" "}
                <span className="text-red-500">*</span>
              </label>
              <Select
                name="event"
                placeholder="Select event"
                className="w-full "
                required
              >
                <Option value="mehendi">Mehendi</Option>
                <Option value="sangeet">Sangeet</Option>
                <Option value="wedding">Wedding</Option>
              </Select>
            </div>
            <div>
              <label className="text-black">
                Coming From? <span className="text-red-500">*</span>
              </label>
              <Input
                className="textarea"
                name="comingFrom"
                placeholder="Text"
                required
              />
            </div>
            <div>
              <label className="text-black">
                Status <span className="text-red-500">*</span>
              </label>
              <Select
                name="status"
                placeholder="Select status"
                className="w-full textarea-select"
                required
              >
                <Option value="confirmed">Confirmed</Option>
                <Option value="pending">Pending</Option>
              </Select>
            </div>
          </div>

          <Divider />

          {subGuests.map((guest, index) => (
            <div key={guest.id} className="flex items-center gap-4">
              {/* Form Box */}
              <div className="border col rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
                {/* Full Name */}
                <div>
                  <label className="text-black">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="textarea"
                    name={`subGuests[${index}][fullName]`}
                    placeholder="Enter full name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-black">
                    Email ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="textarea"
                    name={`subGuests[${index}][email]`}
                    type="email"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                {/* Mobile */}
                <div>
                  <label className="text-black">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="textarea"
                    name={`subGuests[${index}][mobile]`}
                    placeholder="Enter mobile number"
                    required
                  />
                </div>

                {/* Checkbox */}
                <div className="col-span-1">
                  <label>
                    <input
                      type="checkbox"
                      name={`subGuests[${index}][attending]`}
                    />{" "}
                    Attending
                  </label>
                </div>
              </div>

              {/* Delete Button (outside the box) */}
              <button
                type="button"
                title="Delete"
                onClick={() => removeGuest(guest.id)}
                className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center rounded-full p-1 w-8 h-8"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-trash"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                  <path d="M10 11v6"></path>
                  <path d="M14 11v6"></path>
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          ))}

          <div className="flex justify-end items-center">
            <Button
              type="button"
              icon={<PlusOutlined />}
              onClick={handleAddSubGuest}
              className="flex items-center gap-2 px-4 py-2 font-bold rounded-lg border text-[#7A4F26] border-[#7A4F26] bg-[#FDE7C7] transition-colors duration-300"
            >
              Add Sub Guest
            </Button>
          </div>

          <div className="flex items-center justify-between gap-4 mt-4">
            <label className="text-[#1A170F] text-xl font-semibold">
              Need Hotel Accommodation ?
            </label>
            <button
              type="button"
              onClick={() => setShowHotel(!showHotel)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 
      ${showHotel ? "bg-[#7A4F26]" : "bg-gray-300"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300
        ${showHotel ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>
          {showHotel && (
            <HotelAccommodationForm
              formData={formData}
              onInputChange={handleInputChange}
            />
          )}

          <div className="flex items-center justify-between gap-4 mt-4">
            <label className="text-[#1A170F] text-xl font-semibold">
              Need Transportation ?
            </label>
            <button
              type="button"
              onClick={() => setShowTransport(!showTransport)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 
      ${showTransport ? "bg-[#7A4F26]" : "bg-gray-300"}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300
        ${showTransport ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>
          {showTransport && (
            <TransportationForm
              formData={formData}
              onInputChange={handleInputChange}
            />
          )}

          <div className="flex justify-end mt-7">
            <Button
              htmlType="submit"
              className=" bg-[#FDE7C7] rounded-lg text-[#845A12] font-semibold 
                       hover:!bg-[#FDE7C7] hover:!text-[#845A12] hover:!border-none 
                       shadow-addGuest flex items-center gap-2"
            >
              <img
                src={toAbsoluteUrl("/media/guest/save.png")}
                className="w-5 h-5"
                alt="save"
              />
              Save
            </Button>
          </div>
        </form>
      </Container>
    </Fragment>
  );
}

export default GuestForm;
