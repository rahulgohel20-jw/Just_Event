import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const DATE_FORMAT = "DD/MM/YYYY";

/**
 * Props:
 * - size: "small" | "middle" | "large" (antd native size, matches PaginatedSearchSelect)
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
  size = "large",
  className = "",
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
        <p className="text-[13px] font-medium text-dark mb-2">
          {label}
          {required && <span className="text-danger ml-0.5">*</span>}
        </p>
      )}
      <DatePicker
        value={parsedValue}
        onChange={handleChange}
        format={DATE_FORMAT}
        placeholder={placeholder}
        disabled={disabled}
        disabledDate={disabledDate}
        size={size}
        className={`w-full !rounded-lg [&_.ant-picker-input>input]:!text-sm ${className}`}
      />
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </div>
  );
};

export { DateField };
export default DateField;