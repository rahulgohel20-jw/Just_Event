import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { toAbsoluteUrl } from "@/utils";
import { Input, Select, Radio, Switch, Button, Divider, Checkbox } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import HotelAccommodationForm from "@/pages/Guest/HotelAccommodation/HotelAccommodationForm";
import TransportationForm from "@/pages/Guest/TransportationForm/TransportationForm";
const { Option } = Select;

function GuestForm() {
  const [showHotel, setShowHotel] = useState(false);
  const [showTransport, setShowTransport] = useState(false);
  const [subGuests, setSubGuests] = useState([{ id: Date.now() }]);

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

          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Sub Guest</h3>
            <Button
              type="button"
              icon={<PlusOutlined />}
              onClick={handleAddSubGuest}
              className="bg-[#B87B3D] hover:!bg-[#B87B3D] border-none text-white"
            >
              Add Sub Guest
            </Button>
          </div>

          {subGuests.map((guest, index) => (
            <div
              key={guest.id}
              className="border rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div>
                <label className="text-black">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  className="textarea"
                  name={`subGuests[${index}][fullName]`}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="text-black">
                  Email ID <span className="text-red-500">*</span>
                </label>

                <Input
                  className="textarea"
                  name={`subGuests[${index}][email]`}
                  type="email"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label className="text-black">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <Input
                  className="textarea"
                  name={`subGuests[${index}][mobile]`}
                  placeholder="Enter mobile number"
                  required
                />
              </div>
              <div className="col-span-1">
                <Checkbox name={`subGuests[${index}][attending]`}>
                  Attending
                </Checkbox>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between gap-4 mt-4">
            <label className="text-[#1A170F] text-xl font-semibold">
              Need Hotel Accommodation ?
            </label>
            <Switch checked={showHotel} onChange={setShowHotel} />
          </div>
          {showHotel && <HotelAccommodationForm />}

          <div className="flex items-center justify-between gap-4 mt-4">
            <label className="text-[#1A170F] text-xl font-semibold">
              Need Transportation ?
            </label>
            <Switch checked={showTransport} onChange={setShowTransport} />
          </div>
          {showTransport && <TransportationForm />}

          <Button
            htmlType="submit"
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
        </form>
      </Container>
    </Fragment>
  );
}

export default GuestForm;
