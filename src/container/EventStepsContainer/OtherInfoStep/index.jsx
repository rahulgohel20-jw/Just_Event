import { DatePicker } from "antd";
import { Crown, Sparkles } from "lucide-react";
import useStyles from "./style";

const OtherInfoStep = ({ formData, handleInputChange }) => {
  const classes = useStyles();

  return (
    <>
      <h1 className={`flex ${classes.customStyle}`}>
        <Crown className="mr-2 text-primary" /> Groom Information
      </h1>
      <div className="card p-4 bg-white shadow-sm rounded-lg mb-4">
        <div className="flex flex-col gap-y-2 gap-x-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-4">
            <div className="flex flex-col">
              <label className="form-label"> Instagram Link</label>
              <div className="input">
                <i className="ki-filled ki-instagram"></i>
                <input
                  className="h-full"
                  type="text"
                  name="groom_name"
                  placeholder="Instagram Link"
                  value={formData.groom_name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="form-label"> Birth Date</label>
              <DatePicker
                className="input"
                placeholder="Groom Birth Date"
                date={formData.groom_birth_date}
                setDate={(date) =>
                  handleInputChange(
                    { target: { value: date, name: "groom_birth_date" } },
                    index
                  )
                }
              />
            </div>
            <div className="flex flex-col">
              <label className="form-label"> Community</label>
              <div className="input">
                <i className="ki-filled ki-autobrightness"></i>
                <input
                  className="h-full"
                  type="text"
                  name="groom_community"
                  placeholder="Groom Community"
                  value={formData.groom_community}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <h1 className="flex">
        <Sparkles className="mr-2 text-primary" /> Bride Information
      </h1>
      <div className="card p-4 bg-white shadow-sm rounded-lg mb-4">
        <div className="flex flex-col gap-y-2 gap-x-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-y-2 gap-x-4">
            <div className="flex flex-col">
              <label className="form-label"> Instagram Link</label>
              <div className="input">
                <i className="ki-filled ki-instagram"></i>
                <input
                  className="h-full"
                  type="text"
                  name="bride_name"
                  placeholder="Instagram Link"
                  value={formData.bride_name}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="form-label"> Birth Date</label>
              <DatePicker
                className="input"
                placeholder="Bride Birth Date"
                date={formData.bride_birth_date}
                setDate={(date) =>
                  handleInputChange(
                    { target: { value: date, name: "bride_birth_date" } },
                    index
                  )
                }
              />
            </div>
            <div className="flex flex-col">
              <label className="form-label"> Community</label>
              <div className="input">
                <i className="ki-filled ki-autobrightness"></i>
                <input
                  className="h-full"
                  type="text"
                  name="bride_community"
                  placeholder="Bride Community"
                  value={formData.bride_community}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtherInfoStep;
