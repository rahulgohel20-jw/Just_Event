import { Input, DatePicker, Select } from "antd";

const { Option } = Select;
const { TextArea } = Input;

function HotelAccommodationForm() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
      <div>
        <label className="text-black">
          Check-In Date <span className="text-red-500">*</span>
        </label>
        <DatePicker className="w-full textarea" placeholder="mm/dd/yyyy" />
      </div>
      <div>
        <label className="text-black">
          Check-Out Date <span className="text-red-500">*</span>
        </label>
        <DatePicker className="w-full textarea" placeholder="mm/dd/yyyy" />
      </div>
      <div>
        <label className="text-black">
          Room Type <span className="text-red-500">*</span>
        </label>
        <Input className="textarea" placeholder="e.g. King, Queen, Suite" />
      </div>
      <div>
        <label className="text-black">
          Hotel Name <span className="text-red-500">*</span>
        </label>
        <Input
          className="textarea"
          placeholder="e.g. prakash, sunya, krishna"
        />
      </div>
      <div>
        <label className="text-black">
          Hotel Address <span className="text-red-500">*</span>
        </label>
        <Input className="textarea" placeholder="e.g. cross road, new lounge" />
      </div>
      <div>
        <label className="text-black">
          Room Number <span className="text-red-500">*</span>
        </label>
        <Input className="textarea" placeholder="e.g. 305, 205" />
      </div>
      <div>
        <label className="text-black">
          Total Rooms <span className="text-red-500">*</span>
        </label>
        <Input className="textarea" placeholder="e.g. 400" />
      </div>
      <div className="md:col-span-3">
        <label className="text-black">Special Requests</label>
        <TextArea
          placeholder="Any allergies, dietary restrictions, or other requests?"
          rows={5}
        />
      </div>
    </div>
  );
}

export default HotelAccommodationForm;
