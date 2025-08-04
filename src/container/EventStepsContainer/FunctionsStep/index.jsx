import { DatePicker } from "antd";
import FunctionTypeDropdown from "@/components/dropdowns/FunctionTypeDropdown";
import { Textarea } from "@/components/ui/textarea";
import useStyles from "./style";

const FunctionsStep = ({ formData, setFormData }) => {
  const classes = useStyles();

  const handleAddFunction = () => {
    const newFunction = {
      customer_id: "",
      person: "",
      start_date: null,
      end_date: null,
      rate: "",
      raw_material_time: null,
      address: "",
      notes: "",
    };
    setFormData({
      ...formData,
      function_array: [...(formData.function_array || []), newFunction],
    });
  };

  const handleRemoveFunction = (index) => {
    setFormData({
      ...formData,
      function_array: formData.function_array.filter((_, i) => i !== index),
    });
  };

  const handleInputChange = ({ target: { value, name } }, index) => {
    setFormData({
      ...formData,
      function_array: formData.function_array.map((f, i) =>
        i === index ? { ...f, [name]: value } : f
      ),
    });
  };

  return (
    <div>
      {formData &&
        formData.function_array &&
        formData.function_array.length > 0 &&
        formData.function_array.map((func, index) => (
          <div
            className={`card p-4 bg-white shadow-sm rounded-lg mb-4 ${classes.customStyle}`}
            key={index}
          >
            <div className="flex flex-col gap-y-2 gap-x-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-4">
                <div className="flex flex-col">
                  <label className="form-label">Function Name</label>
                  <FunctionTypeDropdown
                    value={func.customer_id}
                    onChange={(e) => handleInputChange(e, index)}
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="form-label">Start Date</label>
                  <DatePicker
                    className="input"
                    date={func.start_date}
                    setDate={(date) =>
                      handleInputChange(
                        { target: { value: date, name: "start_date" } },
                        index
                      )
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="form-label">End Date</label>
                  <DatePicker
                    className="input"
                    date={func.end_date}
                    setDate={(date) =>
                      handleInputChange(
                        { target: { value: date, name: "end_date" } },
                        index
                      )
                    }
                  />
                </div>

                <div className="flex flex-col">
                  <label className="form-label">Notes</label>
                  <Textarea
                    className="textarea h-full"
                    placeholder="Description"
                    rows={3}
                    value={func.notes}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="form-label">Location</label>
                  <Textarea
                    className="textarea h-full"
                    placeholder="Description"
                    rows={3}
                    value={func.address}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={() => handleRemoveFunction(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      {formData &&
        formData.function_array &&
        formData.function_array.length === 0 && (
          <div className="text-center text-gray-500">
            No functions added yet.
          </div>
        )}
      <div className="mt-4 text-center">
        <button
          className="btn btn-success"
          onClick={handleAddFunction}
          title="Add Function"
        >
          <i className="ki-filled ki-plus"></i> Function
        </button>
      </div>
    </div>
  );
};

export default FunctionsStep;
