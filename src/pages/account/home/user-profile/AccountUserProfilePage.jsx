import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { useLayout } from "@/providers";
import ProfileForm from "../../../../components/profile/ProfileForm";
import Password from "../../../../components/profile/passowrd";
import Log from "../../../../components/profile/log";
import {
  UserOutlined,
  SafetyOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import clsx from "clsx";

const AccountUserProfilePage = () => {
  const { currentLayout } = useLayout();
  const [activeTab, setActiveTab] = useState("account");

  const tabs = [
    {
      key: "account",
      icon: UserOutlined,
      title: "Account",
      subtitle: "Manage your profile",
      content: <ProfileForm />,
    },
    {
      key: "security",
      icon: SafetyOutlined,
      title: "Security",
      subtitle: "Manage your password",
      content: <Password />,
    },
    {
      key: "logs",
      icon: HistoryOutlined,
      title: "Logs",
      subtitle: "User Logs",
      content: <Log />,
    },
  ];

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "My Profile" }]} />
        </div>

        <div className="flex gap-6 mb-6 justify-between">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            const Icon = tab.icon;
            return (
              <div
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={clsx(
                  "rounded-2xl px-10 py-6 flex flex-row gap-2 items-center justify-center cursor-pointer transition-all duration-200 shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)] w-full",
                  isActive
                    ? "bg-[#F3F3F3] text-[#a97455] shadow-md"
                    : "bg-white text-gray-400 hover:shadow"
                )}
              >
                <Icon
                  className={`text-3xl rounded-full p-1 ${
                    isActive
                      ? "bg-[#A57353] text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                />
                <div className="flex flex-col ">
                  <span
                    className={clsx(
                      "font-semibold",
                      isActive ? "text-[#a97455]" : "text-[#929292]"
                    )}
                  >
                    {tab.title}
                  </span>
                  <span
                    className={clsx(
                      "text-xs ",
                      isActive ? "text-[#a97455]" : "text-[#929292]"
                    )}
                  >
                    {tab.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {tabs.find((tab) => tab.key === activeTab)?.content}
        </div>
      </Container>
    </Fragment>
  );
};

export { AccountUserProfilePage };
