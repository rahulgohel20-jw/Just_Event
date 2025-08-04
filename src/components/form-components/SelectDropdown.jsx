import { useState, useEffect } from "react";
import { Select, Tooltip } from "antd";
import { PlusCircle } from "lucide-react";
import useStyles from "./SelectDropdownStyle";
import CreateOptionModalComponent from "@/components/form-components/CreateOptionModalComponent";

const SelectDropdown = ({
  apiUrl = null,
  staticOptions = [],
  label,
  placeholder = "Select an option",
  createBtn,
  ...rest
}) => {
  const classes = useStyles();
  const [options, setOptions] = useState(staticOptions);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [createModeOpen, setCreateModeOpen] = useState(false);

  const handleChange = (value) => {
    rest.onChange &&
      rest.onChange({ target: { name: rest.name, value: value } });
  };

  const handleCreate = () => {
    // Logic for creating a new option can be added here
    setCreateModeOpen(true);
  };

  useEffect(() => {
    if (apiUrl) {
      setIsLoading(true);
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch options");
          return response.json();
        })
        .then((data) => {
          setOptions(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err);
          setIsLoading(false);
        });
    }
  }, [apiUrl]);

  useEffect(() => {
    if (staticOptions.length > 0) {
      setOptions(staticOptions);
    }
  }, [staticOptions]);

  return (
    <>
      <div className={`${classes.formGrp} formGrpCommon`}>
        {label && createBtn ? (
          <div className="flex items-end">
            <label className="form-label">{label}</label>
            <Tooltip title="Create new">
              <button onClick={handleCreate} className="mb-1">
                <PlusCircle className="text-primary" />
              </button>
            </Tooltip>
          </div>
        ) : (
          label && <label className="form-label">{label}</label>
        )}
        <Select
          {...rest}
          className={`${classes.select} ${rest.className || ""}`}
          onChange={handleChange}
          options={options}
          placeholder={"Please select"}
        />
      </div>
      {createModeOpen && (
        <CreateOptionModalComponent
          isModalOpen={createModeOpen}
          setIsModalOpen={setCreateModeOpen}
        />
      )}
    </>
  );
};

export { SelectDropdown };
