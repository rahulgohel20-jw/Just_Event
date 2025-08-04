import { useRef, useState } from "react";
import { KeenIcon } from "@/components/keenicons";
import { toAbsoluteUrl } from "@/utils";
import { Menu, MenuItem, MenuToggle } from "@/components";
import { DropdownUser } from "@/partials/dropdowns/user";
import {
  DropdownNotifications,
  DropdownMails,
} from "@/partials/dropdowns/notifications";
import { DropdownChat } from "@/partials/dropdowns/chat";
import { ModalSearch } from "@/partials/modals/search/ModalSearch";
import { useLanguage } from "@/i18n";
import CheckInModal from "@/partials/modals/CheckInModal";
const HeaderTopbar = () => {
  const { isRTL } = useLanguage();
  const itemChatRef = useRef(null);
  const itemAppsRef = useRef(null);
  const itemUserRef = useRef(null);
  const itemNotificationsRef = useRef(null);
  const [checkInModal, setCheckInModal] = useState(false);
  const handleShow = () => {
    window.dispatchEvent(new Event("resize"));
  };
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const handleOpen = () => setSearchModalOpen(true);
  const handleClose = () => {
    setSearchModalOpen(false);
  };
  return (
    <div className="flex items-center gap-2 lg:gap-3.5">
      <button
        onClick={() => setCheckInModal(true)}
        className="btn btn-sm btn-success"
        title="Check In"
      >
        <i className="ki-filled ki-face-id me-0.5"></i>
        Check In
      </button>
      <button
        onClick={handleOpen}
        className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary text-gray-500"
      >
        <KeenIcon icon="magnifier" />
      </button>
      {/* Search */}
      <ModalSearch open={searchModalOpen} onOpenChange={handleClose} />

      {/* whatsapp */}
      <Menu>
        <MenuItem
          ref={itemNotificationsRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? "bottom-start" : "bottom-end",
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: isRTL() ? [-70, 10] : [70, 10], // [skid, distance]
                },
              },
            ],
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="ki-filled ki-whatsapp" />
          </MenuToggle>
          {DropdownChat({
            menuTtemRef: itemChatRef,
          })}
        </MenuItem>
      </Menu>

      {/* Mail */}
      <Menu>
        <MenuItem
          ref={itemNotificationsRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? "bottom-start" : "bottom-end",
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: isRTL() ? [-70, 10] : [70, 10], // [skid, distance]
                },
              },
            ],
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="ki-filled ki-sms" />
          </MenuToggle>
          {DropdownMails({
            menuTtemRef: itemNotificationsRef,
          })}
        </MenuItem>
      </Menu>

      {/* Notifications */}
      <Menu>
        <MenuItem
          ref={itemNotificationsRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? "bottom-start" : "bottom-end",
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: isRTL() ? [-70, 10] : [70, 10], // [skid, distance]
                },
              },
            ],
          }}
        >
          <MenuToggle className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="notification-status" />
          </MenuToggle>
          {DropdownNotifications({
            menuTtemRef: itemNotificationsRef,
          })}
        </MenuItem>
      </Menu>

      {/* user profile */}
      <Menu>
        <MenuItem
          ref={itemUserRef}
          toggle="dropdown"
          trigger="click"
          dropdownProps={{
            placement: isRTL() ? "bottom-start" : "bottom-end",
            modifiers: [
              {
                name: "offset",
                options: {
                  offset: isRTL() ? [-20, 10] : [20, 10], // [skid, distance]
                },
              },
            ],
          }}
        >
          <MenuToggle className="btn btn-icon rounded-full">
            <img
              className="size-9 rounded-full shrink-0"
              src={toAbsoluteUrl("/images/user_img.jpg")}
              alt=""
            />
          </MenuToggle>
          {DropdownUser({
            menuItemRef: itemUserRef,
          })}
        </MenuItem>
      </Menu>
      <CheckInModal
        isModalOpen={checkInModal}
        setIsModalOpen={setCheckInModal}
      />
    </div>
  );
};
export { HeaderTopbar };
