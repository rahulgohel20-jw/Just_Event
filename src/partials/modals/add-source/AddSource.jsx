import { useState } from "react";
import { Input, Button, List, Popconfirm, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const AddSource = () => {
  const [sources, setSources] = useState([
    "Facebook",
    "Referral",
    "Instagram",
    "source_1",
  ]);
  const [newSource, setNewSource] = useState("");

  // Add new source
  const addSource = () => {
    if (newSource.trim() !== "") {
      setSources([...sources, newSource]);
      setNewSource("");
      message.success("Source added successfully");
    } else {
      message.error("Source name cannot be empty");
    }
  };

  // Delete source
  const deleteSource = (source) => {
    setSources(sources.filter((s) => s !== source));
    message.success("Source deleted successfully");
  };

  return (
    <div style={{ padding: 20, background: "#fff", borderRadius: 8 }}>
      <div className="flex flex-row gap-4 mb-4">
        <Input
          value={newSource}
          onChange={(e) => setNewSource(e.target.value)}
          placeholder="Add Source"
          className="w-full"
        />
        <Button
          type="primary"
          onClick={addSource}
          className="w-fit bg-[#A57353]"
        >
          <PlusOutlined />
        </Button>
      </div>

      <List
        header={<div className="text-[#A57353] font-bold">All Source</div>}
        bordered
        dataSource={sources}
        renderItem={(source) => (
          <List.Item
            actions={[
              <Popconfirm
                title="Are you sure to delete?"
                onConfirm={() => deleteSource(source)}
                okText="Yes"
                cancelText="No"
              >
                <Button type="link" icon={<DeleteOutlined />} danger />
              </Popconfirm>,
            ]}
          >
            {source}
          </List.Item>
        )}
      />
    </div>
  );
};

export default AddSource;
