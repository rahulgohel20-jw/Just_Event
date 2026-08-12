import { TimePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

/**
 * TimeInput12h
 * -------------------------------------------------------------------------
 * 12-hour time picker (Ant Design TimePicker under the hood) that stores
 * and emits its value as a plain 12-hour string: "hh:mm A" e.g. "02:10 PM".
 * This is the exact string you should send in the payload — no 24-hour
 * conversion happens anywhere.
 *
 * Usage:
 *   <TimeInput12h value={form.timeFrom} onChange={(val) => updateField("timeFrom", val)} />
 *
 * value example: "09:30 AM", "02:10 PM"
 * -------------------------------------------------------------------------
 */

const FORMAT = "hh:mm A";

const TimeInput12h = ({ value, onChange, placeholder = "--:-- --", disabled = false }) => {
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
      className="w-full !rounded-lg !border-gray-400 !py-2.5"
      popupClassName="time-input-12h-popup"
    />
  );
};

export default TimeInput12h;
export { TimeInput12h };