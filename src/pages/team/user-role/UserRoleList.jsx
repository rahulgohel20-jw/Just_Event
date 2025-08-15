import { Fragment, useEffect } from "react";
import { useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import AddRole from "@/partials/modals/add-role/AddRole";
import { TableComponent } from "@/components/table/TableComponent";
import { getAllRoles } from "@/services/apiServices";
import { columns, defaultData } from "./constant";
import { deleteRole } from "../../../services/apiServices";

const UserRoleList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleEditClick = (data) => {
    console.log(data, "data");

    setEditData(data);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const responseFormate = (data) => {
    const formattedData = data.map((item) => {
      return {
        ...item,
        handleEditClick: handleEditClick,
        removeRole: removeRole,
      };
    });
    return formattedData;
  };

  const removeRole = (roleId) => {
    deleteRole(roleId)
      .then(() => {
        getTableData();
      })
      .catch((error) => {
        console.error("Error deleting role:", error);
      });
  };

  const [tableData, setTableData] = useState([]);

  const getTableData = () => {
    // let data = {
    //   role_name: "Kohler, Pfannerstill and Stoltenberg",
    //   created_at: "2025-07-01T01:25:39.250Z",
    //   updated_at: "2025-07-01T12:49:12.877Z",
    //   isDeleted: 56920,
    // };
    let filters = {
      find: "",
      skip: 0,
      limit: 1000,
      sort: "",
      select: "",
      deep: "",
      getTotalCount: false,
    };
    getAllRoles(filters)
      .then(({ data: { data } }) => {
        setTableData(responseFormate(data));
      })
      .catch((error) => {
        console.error("Error fetching roles:", error);
      })
      .finally(() => {});
  };

  useEffect(() => {
    getTableData();
  }, []);
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "User Roles" }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search role"
                type="text"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              title="Add Role"
              onClick={() => {
                setIsEditMode(false);
                setEditData(null);
                handleModalOpen();
              }}
            >
              <i className="ki-filled ki-plus"></i> Add Role
            </button>
          </div>
        </div>
        <TableComponent
          columns={columns}
          tableData={tableData}
          paginationSize={10}
        />
      </Container>
      <AddRole
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        isEditMode={isEditMode}
        editData={editData}
        successFunction={() => {
          setIsModalOpen(false);
          getTableData();
        }}
      />
    </Fragment>
  );
};
export { UserRoleList };
