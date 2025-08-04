import React, { useRef, useState } from "react";
const AddCustomer = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();
  const handleIconClick = () => {
    fileInputRef.current.click();
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-5xl p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">New Customer</h2>
          <button onClick={onClose} className="text-2xl text-gray-600">
            &times;
          </button>
        </div>
        {/* Form */}
        <div className="overflow-y-auto max-h-[90vh]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Name fields */}
            <InputWithIcon label="Name (English)*" />
            <InputWithIcon label="Name (ગુજરાતી)" />
            <InputWithIcon label="Name (हिंदी)" />
            {/* Home Address */}
            <InputWithIcon label="Home Address (English)" />
            <InputWithIcon label="Home Address (ગુજરાતી)" />
            <InputWithIcon label="Home Address (हिंदी)" />
            {/* Venue */}
            <InputWithIcon label="Venue (English)" />
            <InputWithIcon label="Venue (ગુજરાતી)" />
            <InputWithIcon label="Venue (हिंदी)" />
            {/* Contact Category with dropdown and plus */}
            <div className="flex col-span-1 items-center gap-2">
              <select className="border border-gray-300 rounded-lg p-2 w-full">
                <option>Contact Category*</option>
                <option>Family</option>
                <option>Business</option>
                <option>Friend</option>
              </select>
              <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 text-xl leading-none">
                +
              </button>
            </div>
            <InputSimple label="Email" />
            <InputSimple label="Mobile Number*" />
            <InputSimple label="Alternative Number" />
            <InputSimple label="Office Number" />
            <InputSimple label="Phone Number" />
            <InputSimple label="GST Number" />
            <InputSimple label="PAN Number" />
            <InputSimple label="Phone Number" />
            <div className="relative">
              <label htmlFor="birth_date" className="block text-gray-600 mb-1">
                Birth Date
              </label>
              <input
                type="date"
                className="border border-gray-300 rounded-lg p-2 w-full pr-10 text-gray-600"
                placeholder="Birth Date"
              />
            </div>
            <div className="relative">
              <label
                htmlFor="anniversary_date"
                className="block text-gray-600 mb-1"
              >
                Anniversary Date
              </label>
              <input
                type="date"
                className="border border-gray-300 rounded-lg p-2 w-full pr-10 text-gray-600"
                placeholder="Anniversary Date"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-gray-600">Upload Addhar</label>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleIconClick}
                  className="w-full h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7.414a2 2 0 00-.586-1.414l-2.414-2.414A2 2 0 0013.586 3H4zm5 10a3 3 0 110-6 3 3 0 010 6zm5-5a1 1 0 100-2 1 1 0 000 2z" />
                  </svg>
                </button>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-end mt-6 gap-3">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="button" className="btn btn-success">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
const InputWithIcon = ({ label }) => (
  <div className="relative">
    <label className="block text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      className="border border-gray-300 rounded-lg p-2 w-full"
      placeholder={label}
    />
    <span className="absolute right-2 top-9 text-blue-500 cursor-pointer">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 14a4 4 0 004-4V5a4 4 0 10-8 0v5a4 4 0 004 4zm1 2.93a7 7 0 01-5.2-2.11A1 1 0 104.8 16.8 9 9 0 0010 19a9 9 0 005.2-2.2 1 1 0 00-1.4-1.4A7 7 0 0111 16.93z" />
      </svg>
    </span>
  </div>
);
const InputSimple = ({ label }) => (
  <div>
    <label className="block text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      className="border border-gray-300 rounded-lg p-2 w-full"
      placeholder={label}
    />
  </div>
);
export default AddCustomer;
