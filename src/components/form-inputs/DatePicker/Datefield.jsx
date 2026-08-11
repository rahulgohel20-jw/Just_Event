import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const DATE_FORMAT = "DD/MM/YYYY";

/**
 * Single date component to use everywhere in the app.
 * Stores/emits the date as a "DD/MM/YYYY" string.
 *
 * Props:
 * - label: string
 * - value: "DD/MM/YYYY" string (or "")
 * - onChange: (value: "DD/MM/YYYY" string | "") => void
 * - required: boolean
 * - error: string
 * - placeholder: string
 * - disabled: boolean
 * - disableFuture: boolean  -> blocks picking dates after today
 * - disablePast: boolean    -> blocks picking dates before today
 */
const DateField = ({
  label,
  value,
  onChange,
  required = false,
  error,
  placeholder = "DD/MM/YYYY",
  disabled = false,
  disableFuture = false,
  disablePast = false,
}) => {
  const parsedValue =
    value && dayjs(value, DATE_FORMAT, true).isValid()
      ? dayjs(value, DATE_FORMAT, true)
      : null;

  const handleChange = (date) => {
    onChange(date ? date.format(DATE_FORMAT) : "");
  };

  const disabledDate = (current) => {
    if (!current) return false;
    if (disableFuture && current.isAfter(dayjs(), "day")) return true;
    if (disablePast && current.isBefore(dayjs(), "day")) return true;
    return false;
  };

  return (
    <div>
      {label && (
        <label className="text-xs font-medium text-[#7A2E45] mb-1 block">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </label>
      )}
      <DatePicker
        value={parsedValue}
        onChange={handleChange}
        format={DATE_FORMAT}
        placeholder={placeholder}
        disabled={disabled}
        disabledDate={disabledDate}
        className="w-full !h-[42px] !rounded-lg [&_.ant-picker-input>input]:!text-sm"
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
};

export { DateField };
export default DateField;