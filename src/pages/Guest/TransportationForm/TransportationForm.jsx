import { Input, DatePicker, Select } from "antd";

const { Option } = Select;
const { TextArea } = Input;

function TransportationForm() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
      <div>
        <label className="text-black">
          Pickup Date <span className="text-red-500">*</span>
        </label>
        <DatePicker className="w-full textarea" placeholder="mm/dd/yyyy" />
      </div>
      <div>
        <label className="text-black">
          Drop-off Date <span className="text-red-500">*</span>
        </label>
        <DatePicker className="w-full textarea" placeholder="mm/dd/yyyy" />
      </div>
      <div>
        <label className="text-black">
          Mode of Transport <span className="text-red-500">*</span>
        </label>
        <Input
          className="textarea"
          placeholder="e.g. Car, Mini Bus, Luxury Coach"
        />
      </div>
      <div>
        <label className="text-black">
          Pickup Location <span className="text-red-500">*</span>
        </label>
        <Input className="textarea" placeholder="Location" />
      </div>
      <div>
        <label className="text-black">
          Drop-off Location <span className="text-red-500">*</span>
        </label>
        <Input className="textarea" placeholder="Location" />
      </div>
      <div>
        <label className="text-black">
          No. of Vehicles <span className="text-red-500">*</span>
        </label>
        <Input className="textarea" placeholder="e.g. 3, 4" />
      </div>
      <div>
        <label className="text-black">
          Service Provider Name <span className="text-red-500">*</span>
        </label>
        <Input className="textarea" placeholder="e.g. xyz" />
      </div>
      <div>
        <label className="text-black">
          Payment Status <span className="text-red-500">*</span>
        </label>
        <Select placeholder="Select status textarea" className="w-full">
          <Option value="paid">Paid</Option>
          <Option value="pending">Pending</Option>
        </Select>
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

export default TransportationForm;
