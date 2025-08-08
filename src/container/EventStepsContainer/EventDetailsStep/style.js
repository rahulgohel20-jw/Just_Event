import { makeStyles } from "@mui/styles";
const useStyles = makeStyles({
  basicInfo: {
    "& .select__grp": {
      "& > .form-label": {},
      "& .sg__inner": {
        border: "1px solid var(--tw-gray-400)",
        borderRadius: "6px",
        "& > .input ": {
          border: "0",
        },
        "& > .formGrpCommon": {
          flex: "1",
          "& .ant-select": {
            "& .ant-select-selector": {
              border: "0",
            },
          },
        },
        "& > .sga__btn": {},
      },
    },
  },
});
export default useStyles;
