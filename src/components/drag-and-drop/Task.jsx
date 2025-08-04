import { useContext } from "react";
import { useLanguage } from "@/i18n";
import {
  KeenIcon,
  MenuIcon,
  MenuItem,
  MenuSeparator,
  MenuToggle,
  MenuLink,
  MenuSub,
  MenuTitle,
  Menu,
} from "@/components";
import LeadContext from "@/pages/lead/LeadContext";
import { Link } from "react-router-dom";

const Task = ({ item, dropdown, index }) => {
  const { isRTL } = useLanguage();
  const { setIsLeadModalOpen, setIsNoteModalOpen, setIsFollowUpModalOpen } =
    useContext(LeadContext);

  return (
    <>
      <div
        key={index}
        className="card p-2 lg:p-3 shadow-none user-access-bg bg-[center_top_1.3rem] bg-no-repeat start-now-bg bg-[length:700px]"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <h2 className="font-semibold text-gray-900 leading-none mb-0.5">
                {item.user_first_name}
              </h2>
              <small className="text-2xs text-gray-600 mt-0.5">
                19 days ago
              </small>
            </div>
            <div className="flex items-center">
              <Link to="/lead/details">
                <button
                  className="btn btn-sm btn-icon btn-light btn-clear"
                  title="View"
                >
                  <i className="ki-filled ki-eye"></i>
                </button>
              </Link>
              {dropdown && (
                <Menu className="items-stretch">
                  <MenuItem
                    toggle="dropdown"
                    trigger="click"
                    dropdownProps={{
                      placement: isRTL() ? "bottom-start" : "bottom-end",
                      modifiers: [
                        {
                          name: "offset",
                          options: {
                            offset: isRTL() ? [0, -10] : [0, 10], // [skid, distance]
                          },
                        },
                      ],
                    }}
                  >
                    <MenuToggle className="btn btn-sm btn-icon btn-light btn-clear">
                      <KeenIcon icon="dots-vertical" />
                    </MenuToggle>
                    <MenuSub
                      className="menu-default"
                      rootClassName="w-full max-w-[200px]"
                    >
                      <MenuItem onClick={() => setIsLeadModalOpen(true)}>
                        <MenuLink>
                          <MenuIcon>
                            <KeenIcon icon="ki-filled ki-notepad-edit" />
                          </MenuIcon>
                          <MenuTitle>Edit</MenuTitle>
                        </MenuLink>
                      </MenuItem>
                      <MenuItem>
                        <MenuLink>
                          <MenuIcon>
                            <KeenIcon icon="ki-filled ki-mouse-square" />
                          </MenuIcon>
                          <MenuTitle>Move To</MenuTitle>
                        </MenuLink>
                      </MenuItem>
                      <MenuItem onClick={() => setIsFollowUpModalOpen(true)}>
                        <MenuLink>
                          <MenuIcon>
                            <KeenIcon icon="ki-filled ki-share" />
                          </MenuIcon>
                          <MenuTitle>Add Follow Up</MenuTitle>
                        </MenuLink>
                      </MenuItem>
                      <MenuItem>
                        <MenuLink>
                          <MenuIcon>
                            <KeenIcon icon="ki-filled ki-whatsapp" />
                          </MenuIcon>
                          <MenuTitle>Send Whatsapp</MenuTitle>
                        </MenuLink>
                      </MenuItem>
                      <MenuItem>
                        <MenuLink>
                          <MenuIcon>
                            <KeenIcon icon="ki-filled ki-sms" />
                          </MenuIcon>
                          <MenuTitle>Send Email</MenuTitle>
                        </MenuLink>
                      </MenuItem>
                      <MenuItem onClick={() => setIsNoteModalOpen(true)}>
                        <MenuLink>
                          <MenuIcon>
                            <KeenIcon icon="ki-filled ki-note-2" />
                          </MenuIcon>
                          <MenuTitle>Add Notes</MenuTitle>
                        </MenuLink>
                      </MenuItem>
                      <MenuItem>
                        <MenuLink>
                          <MenuIcon>
                            <KeenIcon icon="ki-filled ki-copy" />
                          </MenuIcon>
                          <MenuTitle>Clone Lead</MenuTitle>
                        </MenuLink>
                      </MenuItem>
                      <MenuSeparator />
                      <MenuItem>
                        <MenuLink path="">
                          <MenuIcon>
                            <KeenIcon icon="ki-filled ki-trash" />
                          </MenuIcon>
                          <MenuTitle>Delete</MenuTitle>
                        </MenuLink>
                      </MenuItem>
                    </MenuSub>
                  </MenuItem>
                </Menu>
              )}
            </div>
          </div>
          <hr />
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              <div className="col-span-1 flex items-center gap-3">
                <KeenIcon icon="user" className="text-success" />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600 mb-0.5">User:</span>
                  <p className="text-sm font-medium text-gray-700 leading-none mt-0.5">
                    {item.user_full_name}
                  </p>
                </div>
              </div>
              <div className="col-span-1 flex items-center gap-3">
                <KeenIcon icon="bill" className="text-success"  />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600 mb-0.5">Amount:</span>
                  <p className="text-sm font-medium text-gray-700 leading-none mt-0.5">
                    {item.amount}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              <div className="col-span-1 flex items-center gap-3">
                <KeenIcon icon="calendar" className="text-success"  />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600 mb-0.5">
                    Close date:
                  </span>
                  <p className="text-sm font-medium text-gray-700 leading-none mt-0.5">
                    {item.close_date}
                  </p>
                </div>
              </div>
              <div className="col-span-1 flex items-center gap-3">
                <KeenIcon icon="user-tick" className="text-success"  />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-600 mb-0.5">
                    Assigned to:
                  </span>
                  <p className="text-sm font-medium text-gray-700 leading-none mt-0.5">
                    {item.assign_to}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="flex items-center justify-start gap-2">
            <div
              className="badge badge-sm badge-pill badge-secondary text-xs"
              title="Stage"
            >
              Cold Lead
            </div>
            <div
              className="badge badge-sm badge-pill badge-secondary text-xs"
              title="Lead 179"
            >
              L-179
            </div>
          </div>
          {/* <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <KeenIcon icon="user" />
            <span>{item.user_full_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <KeenIcon icon="bill" />
            <span>Amount: {item.amount}</span>
          </div>
          <div className="flex items-center gap-2">
            <KeenIcon icon="calendar" />
            <span>Close Date: {item.close_date}</span>
          </div>
          <div className="flex items-center gap-2">
            <KeenIcon icon="user-tick" />
            <span>Assigned To: {item.assign_to}</span>
          </div>
        </div>
         */}
        </div>
      </div>
    </>
  );
};
export { Task };
