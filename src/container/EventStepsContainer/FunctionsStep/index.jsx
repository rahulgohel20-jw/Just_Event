import { DatePicker, TimePicker } from "antd";
import { Input } from "antd";
import { MapPin, StickyNote, Trash2, Plus } from "lucide-react";
import FunctionTypeDropdown from "@/components/dropdowns/FunctionTypeDropdown";
import SubVenueDropdown from "@/components/dropdowns/SubVenueDropdown";
import useStyles from "./style";
import { Search } from "lucide-react";

// DnD-kit imports
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableRow = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: "default",
  };

  return (
    <tr ref={setNodeRef} style={style}>
      <td className="p-4 cursor-grab" {...attributes} {...listeners}>
        <span
          className="text-gray-400 hover:text-gray-600"
          title="Drag to reorder"
        >
          ⠿
        </span>
      </td>
      {children}
    </tr>
  );
};

const FunctionsStep = ({ formData, setFormData }) => {
  const classes = useStyles();

  const handleAddFunction = () => {
    const newFunction = {
      id: Date.now().toString(),
      function_type: "",
      date: null,
      time: null,
      sub_venue: "",
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

  const handleInputChange = (index, field, value) => {
    const updatedArray = [...formData.function_array];
    updatedArray[index][field] = value;
    setFormData({
      ...formData,
      function_array: updatedArray,
    });
  };

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = formData.function_array.findIndex(
        (f) => f.id === active.id
      );
      const newIndex = formData.function_array.findIndex(
        (f) => f.id === over.id
      );
      const reordered = arrayMove(formData.function_array, oldIndex, newIndex);
      setFormData({ ...formData, function_array: reordered });
    }
  };

  return (
    <div className="rounded-md border border-[#C3C3C3] bg-white">
      <div className="p-4 flex justify-between items-center">
        
          
        <Input
  placeholder="Quick Search"
  className="w-1/3"
  allowClear
  prefix={<Search size={16} className="text-gray-700" />}
/>
        
        <button
          className="bg-[#A36C48] text-white px-4 py-2 rounded-md flex items-center gap-2"
          onClick={handleAddFunction}
        >
          Add Function <Plus size={16} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border-[#C3C3C3] border-t">
          <thead className="text-black font-bold border-b border-[#C3C3C3]">
            <tr>
              <th className="p-4 w-10"></th>
              <th className="p-4">Function Type</th>
              <th className="p-4">Date</th>
              <th className="p-4">Time</th>
              <th className="p-4">Sub Venue</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={formData.function_array.map((f) => f.id)}
              strategy={verticalListSortingStrategy}
            >
              <tbody>
                {formData?.function_array?.map((func, index) => (
                  <SortableRow key={func.id} id={func.id}>
                    <td className="p-4">
                      <FunctionTypeDropdown
                        value={func.function_type}
                        onChange={(value) =>
                          handleInputChange(index, "function_type", value)
                        }
                      />
                    </td>
                    <td className="p-4">
                      <DatePicker
                        className="w-full"
                        value={func.date}
                        onChange={(date) =>
                          handleInputChange(index, "date", date)
                        }
                      />
                    </td>
                    <td className="p-4">
                      <TimePicker
                        className="w-full"
                        format="HH:mm"
                        value={func.time}
                        onChange={(time) =>
                          handleInputChange(index, "time", time)
                        }
                      />
                    </td>
                    <td className="p-4">
                      <SubVenueDropdown
                        value={func.sub_venue}
                        onChange={(value) =>
                          handleInputChange(index, "sub_venue", value)
                        }
                      />
                    </td>
                    <td className="p-4 text-center space-x-3">
                      <button type="button" title="Location">
                        <MapPin size={18} className="text-[#A36C48]" />
                      </button>
                      <button type="button" title="Notes">
                        <StickyNote size={18} className="text-[#A36C48]" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveFunction(index)}
                        title="Remove"
                      >
                        <Trash2 size={18} className="text-red-500" />
                      </button>
                    </td>
                  </SortableRow>
                ))}
              </tbody>
            </SortableContext>
          </DndContext>
        </table>

        {formData?.function_array?.length === 0 && (
          <div className="p-4 text-center text-gray-500 mt-4">
            No functions added yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default FunctionsStep;
