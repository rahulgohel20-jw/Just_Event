import { DatePicker } from "antd";
import MealTypeDropdown from "@/components/dropdowns/MealTypeDropdown";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import AddMeal from "@/partials/modals/add-meal/AddMeal";
import useStyles from "./style";

const MealAndNoteStep = ({
  formData,
  setFormData,
  onInputChange,
  handleInputChange,
}) => {
  const classes = useStyles();

  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const handleAddClick = () => {
    setShowCustomerModal(true);
  };

  return (
    <div>
      <div className={`flex flex-col gap-y-2 gap-x-4 ${classes.customStyle}`}>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-y-2">
          <div className="flex flex-col">
            <label className="form-label mb-1">Meal Type</label>

            <div className="relative w-full flex items-center">
              <MealTypeDropdown
                value={formData.meal_type}
                onChange={handleInputChange}
                className="w-full pr-1" // ensures dropdown uses full width
              />

              <button
                type="button"
                onClick={() => handleAddClick("Manager")}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-white rounded-full hover:bg-primary/90 transition flex items-center justify-center"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="form-label">Meal Notes</label>
            <Textarea
              className="textarea h-full"
              placeholder="Description"
              rows={3}
              value={formData.meal_notes}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
      <AddMeal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
      />
    </div>
  );
};

export default MealAndNoteStep;
