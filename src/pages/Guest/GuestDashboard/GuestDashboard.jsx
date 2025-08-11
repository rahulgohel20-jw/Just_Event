import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import StatsCard from "@/components/gujestDashboard/StatsCard";
import GuestTable from "@/components/gujestDashboard/GuestTable";
import { columns, defaultData } from "./constant";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { toAbsoluteUrl } from "@/utils";
import { useNavigate } from "react-router-dom";

function GuestDashboard() {
  const [tableData, setTableData] = useState(defaultData);
  const navigate = useNavigate();

  const handleAddGuestClick = () => {
    navigate("/guest-form");
  };
  return (
    <Fragment>
      <Container>
        <div className="flex justify-between items-center mb-4">
          <Breadcrumbs
            items={[
              {
                title: "Guest Dashboard",
                subTitle: "Manage and track guest responses for your wedding.",
              },
            ]}
          />
          <Button
          icon={<PlusOutlined />}
            className="bg-[#FDE7C7] rounded-lg text-[#845A12] border-[#845A12] font-semibold 
                       hover:!bg-[#FDE7C7] hover:!text-[#845A12] hover:!border-[#845A12] 
                       shadow-addGuest flex items-center gap-2"
            onClick={handleAddGuestClick}
          >
            
            Add Guest
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 mt-10">
          <StatsCard
            icon={
              <img
                src={toAbsoluteUrl("/media/guest/invite.png")}
                alt="invite"
              />
            }
            title="Total Invited Guest"
            value={463}
            subStats={[
              { label: "Groom", value: 231 },
              { label: "Bride", value: 231 },
            ]}
          />
          <StatsCard
            icon={
              <img
                src={toAbsoluteUrl("/media/guest/response.png")}
                alt="response"
              />
            }
            title="Total Responses Received"
            value={320}
            subStats={[
              { label: "Groom", value: 160 },
              { label: "Bride", value: 160 },
            ]}
          />
          <StatsCard
            icon={
              <img src={toAbsoluteUrl("/media/guest/hotel.png")} alt="hotel" />
            }
            title="Hotel Room Allocations"
            value={200}
            subStats={[
              { label: "Groom", value: 100 },
              { label: "Bride", value: 50 },
            ]}
          />
        </div>

        <GuestTable columns={columns} tableData={tableData} />
      </Container>
    </Fragment>
  );
}

export default GuestDashboard;
