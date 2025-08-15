import { Card, Button } from "antd";
import { EditOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import AddEvent from "@/partials/modals/add-event/AddEvent";
import { useState } from "react";
const GuestsCard = () => {
const [isModalOpen, setIsModalOpen] = useState(false);
    const [editData, setEditData] = useState(null);

    const handleModalOpen = () => {
    setIsModalOpen(true);
  };


  const navigate = useNavigate();
  
  return (
    <Card className="rounded-xl border-none shadow-[4px_4px_17px_2px_rgba(0,0,0,0.25)]">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-base font-bold">Guests</h3>
        <div className="flex items-center gap-2 cursor-pointer">
          <EditOutlined className="text-[#A8805C] cursor-pointer" />
          <span className="text-[#A8805C]">Edit</span>
        </div>
      </div>

      <div className="flex justify-center items-center gap-20 mb-4">
        <div className="text-center">
          <p className="text[#6D6D6D] font-normal text-sm mb-2">Groom’s Side</p>
          <UsergroupAddOutlined className="text-[#B67E3F] text-xl" />
          <p className="font-bold text-sm mt-1">2 Guests</p>
        </div>

        <div className="text-center">
          <p className="text[#6D6D6D] font-normal text-sm mb-2 ">
            Bride’s Side
          </p>
          <UsergroupAddOutlined className="text-[#B67E3F] text-xl" />
          <p className="font-bold text-sm mt-1">2 Guests</p>
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <Button
          size="small"
          className="p-4 bg-[#FDE7C7] hover:!bg-[#FDE7C7] hover:!text-[#845A12] hover:!border-none  shadow-eventbtn text-[#845A12] font-medium rounded-md border-none"
          onClick={handleModalOpen}
        >
          Add Guest
        </Button>
      </div>

      <div className="border-t-[2px] border-dashed border-gray-300 pt-2 flex justify-around text-sm text-gray-600">
        <span>
          Total Guests : <span className="text-black">4</span>
        </span>
        <span>
          Confirm Rsvp : <span className="text-black">0</span>
        </span>
      </div>
      <AddEvent
                            isModalOpen={isModalOpen}
                      setIsModalOpen={setIsModalOpen}
                      editData={editData}
                          />
    </Card>
  );
};

export default GuestsCard;
