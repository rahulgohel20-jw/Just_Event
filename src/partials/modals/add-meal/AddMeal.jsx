
import React, { useRef, useState } from "react";

const AddMeal = ({ isOpen, onClose }) => {
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
      <div className="bg-white rounded-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">New Customer</h2>
          <button onClick={onClose} className="text-2xl text-gray-600">&times;</button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">

          {/* Name fields */}
          <InputWithIcon label="Name (English)*" />
          <InputWithIcon label="Name (ગુજરાતી)" />
          <InputWithIcon label="Name (हिंदी)" />

          

             


        </div>
        
    <div className="flex w-full justify-end mt-6 gap-3">
  <button
    type="button"
    onClick={onClose}
    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
  >
    Cancel
  </button>
  <button
    type="button"
    className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
  >
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
      {/* Mic icon */}
      <span className="absolute right-2 top-9 text-blue-500 cursor-pointer">
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 14a4 4 0 004-4V5a4 4 0 10-8 0v5a4 4 0 004 4zm1 2.93a7 7 0 01-5.2-2.11A1 1 0 104.8 16.8 9 9 0 0010 19a9 9 0 005.2-2.2 1 1 0 00-1.4-1.4A7 7 0 0111 16.93z"/>
        </svg>
      </span>
    </div>
  );
  
  // 🔸 Input without icon
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
  

export default AddMeal;
