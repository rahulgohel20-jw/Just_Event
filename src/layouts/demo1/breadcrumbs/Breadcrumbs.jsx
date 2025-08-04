import clsx from "clsx";
import { Fragment, useState } from "react";
import { Building2, Contact, Filter, Plus, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import {
  KeenIcon,
  MenuItem,
  MenuToggle,
  MenuLink,
  MenuSub,
  MenuTitle,
  MenuIcon,
  Menu,
} from "@/components";
import AddLead from "@/partials/modals/add-lead/AddLead";
import AddFollowUp from "@/partials/modals/add-follow-up/AddFollowUp";
import AddContact from "@/partials/modals/add-contact/AddContact";
import AddCompany from "@/partials/modals/add-company/AddCompany";
import { Dropdown, Space } from "antd";

const Breadcrumbs = ({ items }) => {
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);

  const renderItems = (items) => {
    const dashboardItem = (
      <Fragment key={`root-${0}`}>
        <Link
          to={"/"}
          className={"text-sm link shrink-0 hover:underline no-underline"}
          key={`item-${0}`}
          title="Dashboard"
        >
          Dashboard
        </Link>
        <KeenIcon
          icon="right"
          className="text-gray-500 text-3xs"
          key={`separator-${0}`}
        />
      </Fragment>
    );
    let data = items.map((item, index) => {
      const last = index === items.length - 1;
      const key = index + 1;
      return (
        <Fragment key={`root-${key}`}>
          {item.path ? (
            <Link
              to={item.path}
              className={clsx(
                "text-sm link shrink-0 hover:underline no-underline"
              )}
              key={`item-${key}`}
              title={item.title}
            >
              {item.title}
            </Link>
          ) : (
            <span
              className={clsx("text-2sm shrink-0 no-underline text-gray-700")}
              key={`item-${key}`}
            >
              {item.title}
            </span>
          )}
          {!last && (
            <KeenIcon
              icon="right"
              className="text-gray-500 text-3xs"
              key={`separator-${key}`}
            />
          )}
        </Fragment>
      );
    });
    return [dashboardItem, ...data];
  };

  const menuItems = [
    {
      label: <div onClick={() => setIsLeadModalOpen(true)}><i className="ki-filled ki-ki-filled ki-abstract-18 me-1.5"></i>Lead</div>,
      key: "0",
    },
    {
      label: <div onClick={() => setIsFollowUpModalOpen(true)}><i className="ki-filled ki-message-text-2 me-1.5"></i>Follow Up</div>,
      key: "1",
    },
    {
      label: <div onClick={() => setIsContactModalOpen(true)}><i className="ki-filled ki-user me-1.5"></i>Contact</div>,
      key: "2",
    },
    {
      label: <div onClick={() => setIsCompanyModalOpen(true)}><i className="ki-filled ki-bank me-1.5"></i>Company</div>,
      key: "3",
    },
  ];
  return (
    <div className="flex [.header_&]:below-lg:hidden justify-between items-center gap-1.25 text-xs lg:text-sm font-medium">
      <h1 className="text-xl font-medium leading-none text-gray-900">
        {items && items[items.length - 1].title}
      </h1>
      <div className="flex flex-wrap items-center gap-3">
        <div className="sm:flex hidden flex flex-wrap items-center gap-1">
          {items && renderItems(items)}
        </div>
        {/* Menu Dropdown */}
        <Dropdown
          menu={{ items: menuItems }}
          trigger={["click"]}
          // className="max-w-[370px] w-full"
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space>
              <button className="btn btn-sm btn-primary" title="Create New">
                <i className="ki-filled ki-plus"></i>
                Create New
              </button>
            </Space>
          </a>
        </Dropdown>
        {/* End Menu Dropdown */}
      </div>
      <AddLead
        isModalOpen={isLeadModalOpen}
        setIsModalOpen={setIsLeadModalOpen}
      />
      <AddFollowUp
        isModalOpen={isFollowUpModalOpen}
        setIsModalOpen={setIsFollowUpModalOpen}
      />
      <AddContact
        isModalOpen={isContactModalOpen}
        setIsModalOpen={setIsContactModalOpen}
      />
      <AddCompany
        isModalOpen={isCompanyModalOpen}
        setIsModalOpen={setIsCompanyModalOpen}
      />
    </div>
  );
};
export { Breadcrumbs };
