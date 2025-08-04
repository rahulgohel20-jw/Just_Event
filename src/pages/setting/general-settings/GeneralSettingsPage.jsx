import { Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import TabComponent from "@/components/tab/TabComponent";
import {
  RoleAndPermission,
  BulkDataImport,
  ExportLead,
} from "@/container/setting";

const GeneralSettingsPage = () => {
  const tabs = [
    {
      value: "roleandpermission",
      label: (
        <>
          {/* <User className="text-primary" /> */}
          <i className="ki-filled ki-security-user"></i>
          Role & Permission
        </>
      ),
      children: <RoleAndPermission />,
    },
    {
      value: "bulkdata",
      label: (
        <>
          {/* <DatabaseIcon className="text-primary" /> */}
          <i className="ki-filled ki-parcel"></i>
          Bulk Data Import
        </>
      ),
      children: <BulkDataImport />,
    },
    {
      value: "exportleads",
      label: (
        <>
          {/* <Layers className="text-primary" /> */}
          <i className="ki-filled ki-file-down"></i>
          Export Leads
        </>
      ),
      children: <ExportLead />,
    },
  ];
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "General Settings" }]} />
        </div>
        <TabComponent tabs={tabs} />
      </Container>
    </Fragment>
  );
};
export { GeneralSettingsPage };
