import { TimePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const FORMAT = "hh:mm A";

/**
 * Props:
 * - size: "small" | "middle" | "large" (antd native size, matches PaginatedSearchSelect)
 */
const TimeInput12h = ({
  value,
  onChange,
  placeholder = "--:-- --",
  disabled = false,
  size = "large",
  className = "",
}) => {
  const parsedValue = value ? dayjs(value, FORMAT) : null;

  const handleChange = (time) => {
    onChange?.(time ? time.format(FORMAT) : "");
  };

  return (
    <TimePicker
      value={parsedValue && parsedValue.isValid() ? parsedValue : null}
      onChange={handleChange}
      format={FORMAT}
      use12Hours
      placeholder={placeholder}
      disabled={disabled}
      size={size}
      className={`w-full !rounded-lg [&_.ant-picker-input>input]:!text-sm ${className}`}
      popupClassName="time-input-12h-popup"
    />
  );
};

export default TimeInput12h;
export { TimeInput12h };