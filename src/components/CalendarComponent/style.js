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

      "& .fc-day": {
        "&.fc-day-future": {
          "& .fc-daygrid-day-frame": {
            transition: ".3s ease-in-out",
            "&:hover, &:focus, &:active": {
              boxShadow: "var(--tw-default-box-shadow)",
              backgroundColor: "var(--tw-gray-200)",
            },
          },
        },
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
              cursor: "pointer",
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
                      textTransform: "uppercase",
                    },
                  },
                },
              },
            },
          },
        },
        "&.fc-day-today": {
          backgroundColor: "var(--tw-primary-lighter)",
          cursor: "pointer",
          "& .fc-daygrid-day-top": {
            marginBottom: "5px",
            "& .fc-daygrid-day-number": {
              color: "var(--tw-light)",
              background: "var(--tw-primary)",
              borderRadius: "50rem",
              position: "relative",
              top: "4px",
              right: "4px",
              width: "24px",
              height: "24px",
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
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
      "& .fc-button": {
        borderRadius: "0.375rem",
        fontSize: "0.8125rem",
        height: "38px",
        "&.fc-today-button": {
          color: "var(--tw-light)",
          borderColor: "var(--tw-primary)",
          backgroundColor: "var(--tw-primary)",
          "&:not(:disabled):active:focus,&:hover, &:focus, &:active, &.active":
          {
            boxShadow: "var(--tw-primary-box-shadow)",
            backgroundColor: "var(--tw-primary-active)",
          },
        },
      },
      "& .fc-next-button, & .fc-prev-button": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "& .fc-icon": {
          fontSize: "1.25em",
        },
        "&.fc-button": {
          color: "var(--tw-gray-700)",
          borderColor: "var(--tw-gray-300)",
          backgroundColor: "var(--tw-light)",
          "&:hover, &:focus, &:active, &.active": {
            borderColor: "var(--tw-gray-300) !important",
            backgroundColor: "var(--tw-light-active)",
            boxShadow: "var(--tw-default-box-shadow) !important",
            color: "var(--tw-gray-800)",
          },
        },
      },
      "& .fc-dayGridMonth-button, & .fc-dayGridWeek-button, & .fc-timeGridDay-button, & .fc-listWeek-button":
      {
        "&.fc-button": {
          display: "inline-flex",
          alignItems: "center",
          cursor: "pointer",
          gap: "0.375rem",
          fontWeight: "500",
          outline: "none",
          color: "var(--tw-gray-700)",
          borderColor: "var(--tw-gray-300)",
          backgroundColor: "var(--tw-light) !important",
          "&:hover, &:focus, &:active": {
            borderColor: "var(--tw-gray-300) !important",
            backgroundColor: "var(--tw-light-active)",
            boxShadow: "var(--tw-default-box-shadow) !important",
            color: "var(--tw-gray-800)",
          },
          "&:not(:disabled).active, &:not(:disabled).fc-button-active, &.fc-button-active:hover":
          {
            borderColor: "var(--tw-primary) !important",
            backgroundColor: "var(--tw-primary) !important",
            color: "var(--tw-light)",
          },
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
