import { makeStyles } from "@mui/styles";
const useStyles = makeStyles({
  fullCalendar: {
    "& .fc-media-screen": {
      "& table": {
        borderColor: "var(--tw-gray-300)",
      },
      "& th, & td": {
        borderColor: "var(--tw-gray-300)",
      },
      // fc-dayGridMonth-view
      "& .fc-dayGridMonth-view": {},
      // fc-dayGridWeek-view
      "& .fc-dayGridWeek-view": {},
      "& .fc-daygrid-day": {
        "& .fc-daygrid-day-events": {
          "& .fc-event": {
            "&.fc-event-start": {
              height: "20px",
              borderRadius: "4px",
              "& .fc-event-main": {
                height: "20px",
                "& .fc-event-main-frame": {
                  height: "20px",
                  "& .fc-event-title-container": {
                    "& .fc-event-title": {
                      height: "20px",
                      lineHeight: "1.3",
                      paddingLeft: "4px",
                      fontSize: "12px",
                    },
                  },
                },
              },
            },
          },
        },

        "&.fc-day-today": {
          backgroundColor: "var(--tw-primary-lighter)",
          "& .fc-daygrid-day-number": {
            color: "var(--tw-light)",
            background: "var(--tw-primary)",
            borderRadius: "50rem",
            position: "relative",
            top: "4px",
            right: "4px",
            width: "28px",
            height: "28px",
            padding: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        },
      },
      "& .fc-daygrid-day-number": {
        padding: "6px",
        lineHeight: "1",
        fontSize: "14px",
        fontWeight: "500",
        color: "var(--tw-gray-700)",
      },
      "& .fc-button-primary": {
        backgroundColor: "var(--tw-primary)",
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
        borderRadius: "0.375rem",
        height: "2.5rem",
        paddingInlineStart: "1rem",
        paddingInlineEnd: "1rem",
        gap: "0.375rem",
        border: "1px solid transparent",
        fontWeight: "500",
        fontSize: "0.8125rem",
        outline: "none",
        "&:not(:disabled):active:focus": {
          boxShadow: "var(--tw-primary-box-shadow)",
          borderColor: "var(--tw-primary)",
        },
        "&:focus, &.active, &:active, &:not(:disabled).fc-button-active": {
          boxShadow: "var(--tw-primary-box-shadow)",
          backgroundColor: "var(--tw-primary-active)",
          borderColor: "var(--tw-primary)",
        },
      },
      "& .fc-header-toolbar": {
        marginBottom: "10px",
        "& .fc-toolbar-chunk": {
          "& .fc-toolbar-title": {
            color: "var(--tw-gray-900)",
            fontSize: "18px",
            fontWeight: "600",
          },
          "&:nth-child(1)": {
            display: "flex",
            "& .fc-button-group": {},
            "& .fc-button": {
              "& .fc-button-primary": {},
            },
          },
          "&:nth-child(2)": {
            display: "flex",
          },
          "&:nth-child(3)": {
            display: "flex",
          },
        },
      },
      "& .fc-view-harness": {
        "& .fc-view": {
          "& > table": {
            "& > thead": {
              backgroundColor: "var(--tw-gray-100)",
              "& .fc-col-header-cell-cushion": {
                padding: "4px",
                fontSize: "14px",
                fontWeight: "600",
                color: "var(--tw-gray-900)",
                textTransform: "uppercase",
              },
            },
            "& > tbody": {},
          },
          // fc-dayGridMonth-view
          "&.fc-dayGridMonth-view": {},
          // fc-fc-dayGridWeek-view
          "&.fc-fc-dayGridWeek-view": {},
        },
      },
    },
  },
});
export default useStyles;
